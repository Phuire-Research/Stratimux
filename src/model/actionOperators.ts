/*<$
For the asynchronous graph programming framework Stratimux, define the Action Operator model file.
This file dictates the functionality of both Debounce, Throttle Methods and
their interaction with ActionStrategy.
$>*/
/*<#*/
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InteropObservable,
  MonoTypeOperatorFunction,
  Observable,
  ObservableInput,
  OperatorFunction,
  SchedulerAction,
  SchedulerLike,
  Subscriber,
  Subscription,
  ThrottleConfig,
  asyncScheduler,
  timer
} from 'rxjs';
import { Action } from './action';
import { axiumConclude } from '../concepts/axium/qualities/conclude.quality';

function hasLift(source: any): source is { lift: InstanceType<typeof Observable>['lift'] } {
  return typeof source?.lift === 'function';
}
function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function';
}
const observable: string | symbol = (() => (typeof Symbol === 'function' && Symbol.observable) || '@@observable')();

function isInteropObservable(input: any): input is InteropObservable<any> {
  return isFunction(input[observable]);
}
function fromInteropObservable<T>(obj: any) {
  return new Observable((subscriber: Subscriber<T>) => {
    const obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    // Should be caught by observable subscribe function error handling.
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function createInvalidObservableTypeError(input: any) {
  // TODO: We should create error codes that can be looked up, so this can be less verbose.
  return new TypeError(
    `You provided ${
      input !== null && typeof input === 'object' ? 'an invalid object' : `'${input}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function innerFrom<T>(input: ObservableInput<T>): Observable<T> {
  if (input instanceof Observable) {
    return input;
  }
  if (input !== null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
  }

  throw createInvalidObservableTypeError(input);
}
function operate<T, R>(
  init: (liftedSource: Observable<T>, subscriber: Subscriber<R>) => (() => void) | void
): OperatorFunction<T, R> {
  return (source: Observable<T>) => {
    if (hasLift(source)) {
      // eslint-disable-next-line consistent-return
      return source.lift(function (this: Subscriber<R>, liftedSource: Observable<T>) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError('Unable to lift unknown Observable type');
  };
}

class OperatorSubscriber<T> extends Subscriber<T> {
  constructor(
    destination: Subscriber<any>,
    onNext?: (value: T) => void,
    onComplete?: () => void,
    onError?: (err: any) => void,
    private onFinalize?: () => void,
    private shouldUnsubscribe?: () => boolean
  ) {
    super(destination);
    this._next = onNext
      ? function (this: OperatorSubscriber<T>, value: T) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      }
      : super._next;
    this._error = onError
      ? function (this: OperatorSubscriber<T>, err: any) {
        try {
          onError(err);
        } catch (error) {
          // Send any errors that occur down stream.
          destination.error(error);
        } finally {
          // Ensure finalization.
          this.unsubscribe();
        }
      }
      : super._error;
    this._complete = onComplete
      ? function (this: OperatorSubscriber<T>) {
        try {
          onComplete();
        } catch (err) {
          // Send any errors that occur down stream.
          destination.error(err);
        } finally {
          // Ensure finalization.
          this.unsubscribe();
        }
      }
      : super._complete;
  }

  unsubscribe() {
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      const { closed } = this;
      super.unsubscribe();
      !closed && this.onFinalize?.();
    }
  }
}

function createOperatorSubscriber<T>(
  destination: Subscriber<any>,
  onNext?: (value: T) => void,
  onComplete?: () => void,
  onError?: (err: unknown) => void,
  onFinalize?: () => void
): Subscriber<T> {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}

/**
 * This will prevent all actions for the specified duration, but will still emit actions as axiumConclude
 *  Thus this needs to be taken into account in the Method using debounceAction if implemented directly.
 *   But will be handled automatically in actionControllers and associated debounce createMethods.
 */
export function debounceAction(dueTime: number, scheduler: SchedulerLike = asyncScheduler): MonoTypeOperatorFunction<Action> {
  return operate((source, subscriber) => {
    let activeTask: Subscription | null = null;
    let lastValue: Action | null = null;
    let lastTime: number | null = null;

    const emit = () => {
      if (activeTask) {
        activeTask.unsubscribe();
        activeTask = null;
        const value = lastValue!;
        lastValue = null;
        subscriber.next(value);
      }
    };
    function emitWhenIdle(this: SchedulerAction<unknown>) {
      const targetTime = lastTime! + dueTime;
      const now = scheduler.now();
      if (now < targetTime) {
        activeTask = this.schedule(undefined, targetTime - now);
        subscriber.add(activeTask);
        return;
      }

      emit();
    }

    source.subscribe(
      createOperatorSubscriber(
        subscriber,
        (value: Action) => {
          lastValue = value;
          lastTime = scheduler.now();
          if (!activeTask) {
            activeTask = scheduler.schedule(emitWhenIdle, dueTime);
            subscriber.add(activeTask);
          } else {
            // All this code just to place this code block.
            const conclude = {
              ...value,
              ...axiumConclude(),
            };
            subscriber.next(
              conclude
            );
          }
        },
        () => {
          emit();
          subscriber.complete();
        },
        undefined,
        () => {
          lastValue = activeTask = null;
        }
      )
    );
  });
}

function throttle(durationSelector: (value: Action) => ObservableInput<any>, config?: ThrottleConfig): MonoTypeOperatorFunction<Action> {
  return operate((source, subscriber) => {
    const { leading = true, trailing = false } = config ?? {};
    let hasValue = false;
    let sendValue: Action | null = null;
    let throttled: Subscription | null = null;
    let isComplete = false;

    const endThrottling = (value: Action) => {
      throttled?.unsubscribe();
      throttled = null;
      if (trailing) {
        send();
        isComplete && subscriber.complete();
      } else {
        passConclude(value);
      }
    };

    const cleanupThrottling = () => {
      throttled = null;
      isComplete && subscriber.complete();
    };

    const startThrottle = (value: Action) =>
      (throttled = innerFrom(durationSelector(value)).subscribe(createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling)));
    const passConclude = (value: Action) => {
      subscriber.next({
        ...value,
        ...axiumConclude()
      });
    };

    const send = () => {
      if (hasValue) {
        hasValue = false;
        const value = sendValue!;
        sendValue = null;
        subscriber.next(value);
        !isComplete && startThrottle(value);
      }
    };

    source.subscribe(
      createOperatorSubscriber(
        subscriber,
        (value) => {
          hasValue = true;
          sendValue = value;
          !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
        },
        () => {
          isComplete = true;
          !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
        }
      )
    );
  });
}
/**
 * This will permit the first action, then filter actions for the specified duration, but will still emit actions as axiumConclude
 *  Thus this needs to be taken into account in the Method using throttleAction if implemented directly.
 *   But will be handled automatically in actionControllers and associated debounce createMethods.
 */
export function throttleAction(
  duration: number,
  scheduler: SchedulerLike = asyncScheduler,
  config?: ThrottleConfig
): MonoTypeOperatorFunction<Action> {
  const duration$ = timer(duration, scheduler);
  return throttle(() => duration$, config);
}
/*#>*/