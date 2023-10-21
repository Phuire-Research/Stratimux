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
// const isArrayLike = (<T>(x: any): x is ArrayLike<T> => x && typeof x.length === 'number' && typeof x !== 'function');
// function fromArrayLike<T>(array: ArrayLike<T>) {
//   return new Observable((subscriber: Subscriber<T>) => {
//     // Loop over the array and emit each value. Note two things here:
//     // 1. We're making sure that the subscriber is not closed on each loop.
//     //    This is so we don't continue looping over a very large array after
//     //    something like a `take`, `takeWhile`, or other synchronous unsubscription
//     //    has already unsubscribed.
//     // 2. In this form, reentrant code can alter that array we're looping over.
//     //    This is a known issue, but considered an edge case. The alternative would
//     //    be to copy the array before executing the loop, but this has
//     //    performance implications.
//     for (let i = 0; i < array.length && !subscriber.closed; i++) {
//       subscriber.next(array[i]);
//     }
//     subscriber.complete();
//   });
// }
// function isPromise(value: any): value is PromiseLike<any> {
//   return isFunction(value?.then);
// }
// const timeoutProvider: TimeoutProvider = {
//   // When accessing the delegate, use the variable rather than `this` so that
//   // the functions can be called without being bound to the provider.
//   setTimeout(handler: () => void, timeout?: number, ...args) {
//     const { delegate } = timeoutProvider;
//     if (delegate?.setTimeout) {
//       return delegate.setTimeout(handler, timeout, ...args);
//     }
//     return setTimeout(handler, timeout, ...args);
//   },
//   clearTimeout(handle) {
//     const { delegate } = timeoutProvider;
//     return (delegate?.clearTimeout || clearTimeout)(handle as any);
//   },
//   delegate: undefined,
// };
// function reportUnhandledError(err: any) {
//   timeoutProvider.setTimeout(() => {
//     const { onUnhandledError } = config;
//     if (onUnhandledError) {
//       // Execute the user-configured error handler.
//       onUnhandledError(err);
//     } else {
//       // Throw so it is picked up by the runtime's uncaught error mechanism.
//       throw err;
//     }
//   });
// }
// function fromPromise<T>(promise: PromiseLike<T>) {
//   return new Observable((subscriber: Subscriber<T>) => {
//     promise
//       .then(
//         (value) => {
//           if (!subscriber.closed) {
//             subscriber.next(value);
//             subscriber.complete();
//           }
//         },
//         (err: any) => subscriber.error(err)
//       )
//       .then(null, reportUnhandledError);
//   });
// }
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
    // if (isArrayLike(input)) {
    //   return fromArrayLike(input);
    // }
    // if (isPromise(input)) {
    //   return fromPromise(input);
    // }
    // if (isAsyncIterable(input)) {
    //   return fromAsyncIterable(input);
    // }
    // if (isIterable(input)) {
    //   return fromIterable(input);
    // }
    // if (isReadableStreamLike(input)) {
    //   return fromReadableStreamLike(input);
    // }
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
        // Ensure we clear out our value and hasValue flag
        // before we emit, otherwise reentrant code can cause
        // issues here.
        hasValue = false;
        const value = sendValue!;
        sendValue = null;
        // Emit the value.
        subscriber.next(value);
        !isComplete && startThrottle(value);
      }
    };

    source.subscribe(
      createOperatorSubscriber(
        subscriber,
        // Regarding the presence of throttled.closed in the following
        // conditions, if a synchronous duration selector is specified - weird,
        // but legal - an already-closed subscription will be assigned to
        // throttled, so the subscription's closed property needs to be checked,
        // too.
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