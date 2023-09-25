import { BehaviorSubject, Observable, Subscriber, Observer, Subscription, TeardownLogic } from 'rxjs';
import { Concept } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';

export type UnifiedSubject = {
  closed: () => boolean;
  next: (value: Concept[]) => void;
  error: (err: any) => void;
  complete: () => void;
  unsubscribe: () => void;
  subscribe: (observerOrNext?: Observer<Concept[]> | ((value: Observer<Concept[]>) => void) | null) => Subscription;
}

export function createUnifiedSubject(): UnifiedSubject {
  let _closed = false;
  let _observerCounter = 0;
  const _currentObservers: Map<number, Observer<Concept[]>> = new Map();
  // let _observerSnapshot: Observer<Concept[]>[] = [];

  // const _observers = () => {
  //   return (_observerSnapshot ??= Array.from(_currentObservers.values()));
  // };

  const _clearObservers = () => {
    _currentObservers.clear();
    // _observerSnapshot = [];
  };
  const _subscribe = (observerOrNext?: Observer<Concept[]> | ((value: Observer<Concept[]>) => void) | null): Subscription => {
    const subscriber = observerOrNext instanceof Subscriber ? observerOrNext : new Subscriber(observerOrNext as Subscriber<Concept[]>);
    subscriber.add(_trySubscribe(subscriber));
    _currentObservers.set(_observerCounter, subscriber);
    _observerCounter++;
    return subscriber;
  };
  // eslint-disable-next-line consistent-return
  function _trySubscribe(sink: Subscriber<Concept[]>): TeardownLogic {
    try {
      return _subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  }
  return {
    closed: () => _closed,
    next: (value: Concept[]) => {
      if (!_closed) {
        // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
        // Where Dispatcher would be (action$: Subject<Action>) => {}();
        _currentObservers.forEach(observer => {
          observer.next(value);
        });
      }
    },
    error: (err: any) => {
      if (!_closed) {
        _closed = true;
        _currentObservers.forEach(observer => {
          observer.error(err);
        });
        _clearObservers();
      }
    },
    complete: () => {
      if (!_closed) {
        _closed = true;
        _currentObservers.forEach(observer => {
          observer.complete();
        });
        _clearObservers();
      }
    },
    unsubscribe: () => {
      _closed = true;
      _clearObservers();
    },
    subscribe: _subscribe,
  };
}

// stage(stage: Staged) {
//     const axiumState = this.getValue()[0].state as AxiumState;
//     // Provides a specific Dispatch Function that may be used to identify point of origin to stop action overflow
//     //  via Subscription Notifications
//     //  This becomes part of concept[0].state as AxiumState as this Subject is Designed for the Axium
//     //  Dispatch would be action + options { dispatchOnce: boolean, afterTopic: string, etc... }
//     //    This is to provide an additional Abstraction that likewise is aware of its Context, Action Expiration, etc...
//     //  With this addition, this overall System would move towards being Halting Complete and Release Ready alongside Paper.
//   }

// # Goal
//  Allow for a Set of Stages that can be Iterated or Set
//  While still allowing the complete cancellation of the Stage if the actions overflow
//  If the Stage is Cancelled, Group is added to axium.failedStages
//  This allows for Concepts to Reinitialize, but only by specific design if that Staging Fails
//
// ## Mock
// axium.stage("Some Group",[
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     // Init
//     dispatch(someAction,{
//       iterateStage: true,
//     });
// },
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     dispatch(anotherAction,{
//       afterTopic: someTopic,
//       iterateStage: true,
//     });
// },
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     dispatch(anotherAction,{
//       on: {
//         selector: keyedSelector,
//         expected: value
//       },
//       setStage: 0,
//     });
//     dispatch(anotherAction,{
//       on: {
//         selector: keyedSelector,
//         expected: value,
//         debounce: 5000
//       },
//     });
// ]);
