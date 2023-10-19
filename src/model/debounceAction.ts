import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  SchedulerAction,
  SchedulerLike,
  Subscriber,
  Subscription,
  asyncScheduler
} from 'rxjs';
import { Action } from './action';
import { axiumConclude } from '../concepts/axium/qualities/conclude.quality';

function hasLift(source: any): source is { lift: InstanceType<typeof Observable>['lift'] } {
  return typeof source?.lift === 'function';
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
  onError?: (err: any) => void,
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