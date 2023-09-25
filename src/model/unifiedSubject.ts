import { BehaviorSubject, Observable, Subscriber, Observer, Subscription, TeardownLogic, Subject } from 'rxjs';
import { Concept } from './concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { KeyedSelector, selectSlice } from './selector';
import { Action, ActionType } from './action';

export type _UnifiedSubject = {
  closed: () => boolean;
  next: (value: Concept[]) => void;
  error: (err: any) => void;
  complete: () => void;
  unsubscribe: () => void;
  subscribe: (observerOrNext?: Observer<Concept[]> | ((value: Concept[]) => void) | null) => Subscription;
}

export type Staged = {
  stages: Staging[],
  step: number;
}

export type dispatchOptions = {
  runOnce?: boolean;
  iterateStep?: boolean;
  setStep?: number;
  on?: {
    selector: KeyedSelector,
    expected: any
  },
  debounce?: number;
}

export type Dispatcher = (action: Action, options?: dispatchOptions) => void;
export type Staging = (
  concepts: Concept[],
  dispatch: (action: Action, options: dispatchOptions) => void
) => void;
export type Stage = (id: number) => () => void;

export class UnifiedSubject extends Subject<Concept[]> {
  private stageId = 0;
  private currentStages: Map<number, Staged> = new Map();
  private stageDelimiter: Map<number, {prevActionType: ActionType, count: number, firstExpiration: number}> = new Map();
  constructor() {
    super();
  }
  protected stage(stages: Staging[]) {
    this.currentStages.set(this.stageId, {stages, step: 0});
    this.stageId++;
    return {
      unstage: () => {
        this.currentStages.delete(this.stageId);
      }
    };
  }

  next(value: Concept[]) {
    if (!this.closed) {
      // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
      // Where Dispatcher would be (action$: Subject<Action>) => {}();
      const axiumState = value[0].state as AxiumState;
      this.currentStages.forEach((staged, key) => {
        const dispatcher: Dispatcher = (action: Action, options?: dispatchOptions) => {
          const stageDelimiter = this.stageDelimiter.get(key);
          let debounce = false;
          let goodAction = true;
          if (stageDelimiter && stageDelimiter.prevActionType === action.type) {
            const count = stageDelimiter.count + 1;
            if (count > 2 && action.expiration - stageDelimiter.firstExpiration > 50 ) {
              goodAction = false;
            }
            this.stageDelimiter.set(key, {
              prevActionType: stageDelimiter.prevActionType,
              count: count,
              firstExpiration: stageDelimiter.firstExpiration,
            });
          } else {
            this.stageDelimiter.set(key, {
              prevActionType: action.type,
              count: 0,
              firstExpiration: action.expiration
            });
          }
          const action$ = axiumState.action$ as Subject<Action>;
          if (options?.runOnce) {
            staged.step = staged.stages.length;
          }
          if (options?.setStep) {
            staged.step = options.setStep;
          }
          if (options?.iterateStep) {
            staged.step += 1;
          }
          if (options?.debounce) {
            if (stageDelimiter) {
              if (stageDelimiter.firstExpiration > Date.now() + options?.debounce) {
                debounce = true;
              }
            }
          }
          if (options?.on && goodAction && !debounce) {
            if (selectSlice(value, options?.on.selector) === options?.on.expected) {
              action$.next(action);
            }
          } else if (!debounce && goodAction) {
            action$.next(action);
          } else {
            axiumState.badStages.push(staged);
            this.currentStages.delete(key);
          }
        };
        const index = staged.step;
        if (index < staged.stages.length) {
          staged.stages[index](value, dispatcher);
        }
      });
    }
    const {observers} = this;

    const len = observers.length;
    for (let i = 0; i < len; i++) {
      observers[i].next(value);
    }
  }
}

// export function createUnifiedSubject(): _UnifiedSubject {
//   let _closed = false;
//   let _observerCounter = 0;
//   const _currentObservers: Map<number, Observer<Concept[]>> = new Map();
//   const _currentStages: Map<number, Staged> = new Map();
//   const _stageDelimiter: Map<number, {prevActionType: ActionType, count: number, firstExpiration: number}> = new Map();
//   // let _observerSnapshot: Observer<Concept[]>[] = [];

//   // const _observers = () => {
//   //   return (_observerSnapshot ??= Array.from(_currentObservers.values()));
//   // };

//   const _clearObservers = () => {
//     _currentObservers.clear();
//     // _observerSnapshot = [];
//   };
//   const _subscribe = (observerOrNext?: Observer<Concept[]> | ((value: Concept[]) => void) | null): Subscription => {
//     const subscriber = observerOrNext instanceof Subscriber ? observerOrNext : new Subscriber(observerOrNext as Subscriber<Concept[]>);
//     subscriber.add(_trySubscribe(subscriber));
//     _currentObservers.set(_observerCounter, subscriber);
//     _observerCounter++;
//     return subscriber;
//   };
//   const _stage = (stages: Staging[]) => {
//     const stageId = _observerCounter;
//     _currentStages.set(stageId, {stages, step: 0});
//     _observerCounter++;
//     return {
//       unstage: () => {
//         _currentStages.delete(stageId);
//       }
//     };
//   };
//   // eslint-disable-next-line consistent-return
//   function _trySubscribe(sink: Subscriber<Concept[]>): TeardownLogic {
//     try {
//       return _subscribe(sink);
//     } catch (err) {
//       sink.error(err);
//     }
//   }
//   return {
//     closed: () => _closed,
//     next: (value: Concept[]) => {
//       if (!_closed) {
//         // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
//         // Where Dispatcher would be (action$: Subject<Action>) => {}();
//         const axiumState = value[0].state as AxiumState;
//         _currentStages.forEach((staged, key) => {
//           const dispatcher: Dispatcher = (action: Action, options?: dispatchOptions) => {
//             const stageDelimiter = _stageDelimiter.get(key);
//             let debounce = false;
//             let goodAction = true;
//             if (stageDelimiter && stageDelimiter.prevActionType === action.type) {
//               const count = stageDelimiter.count + 1;
//               if (count > 2 && action.expiration - stageDelimiter.firstExpiration > 50 ) {
//                 goodAction = false;
//               }
//               _stageDelimiter.set(key, {
//                 prevActionType: stageDelimiter.prevActionType,
//                 count: count,
//                 firstExpiration: stageDelimiter.firstExpiration,
//               });
//             } else {
//               _stageDelimiter.set(key, {
//                 prevActionType: action.type,
//                 count: 0,
//                 firstExpiration: action.expiration
//               });
//             }
//             const action$ = axiumState.action$ as Subject<Action>;
//             if (options?.runOnce) {
//               staged.step = staged.stages.length;
//             }
//             if (options?.setStep) {
//               staged.step = options.setStep;
//             }
//             if (options?.iterateStep) {
//               staged.step += 1;
//             }
//             if (options?.debounce) {
//               if (stageDelimiter) {
//                 if (stageDelimiter.firstExpiration > Date.now() + options?.debounce) {
//                   debounce = true;
//                 }
//               }
//             }
//             if (options?.on && goodAction && !debounce) {
//               if (selectSlice(value, options?.on.selector) === options?.on.expected) {
//                 action$.next(action);
//               }
//             } else if (!debounce && goodAction) {
//               action$.next(action);
//             } else {
//               axiumState.badStages.push(staged);
//               _currentStages.delete(key);
//             }
//           };
//           const index = staged.step;
//           if (index < staged.stages.length) {
//             staged.stages[index](value, dispatcher);
//           }
//         });
//       }
//       _currentObservers.forEach(observer => {
//         observer.next(value);
//       });
//     },
//     error: (err: any) => {
//       if (!_closed) {
//         _closed = true;
//         _currentObservers.forEach(observer => {
//           observer.error(err);
//         });
//         _clearObservers();
//       }
//     },
//     complete: () => {
//       if (!_closed) {
//         _closed = true;
//         _currentObservers.forEach(observer => {
//           observer.complete();
//         });
//         _clearObservers();
//       }
//     },
//     unsubscribe: () => {
//       _closed = true;
//       _clearObservers();
//     },
//     subscribe: _subscribe,
//   };
// }

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
//       iterateStep: true,
//     });
// },
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     dispatch(anotherAction,{
//       afterTopic: someTopic,
//       iterateStep: true,
//     });
// },
//   (concepts: Concept[], dispatch: Dispatcher) => {
//     dispatch(anotherAction,{
//       on: {
//         selector: keyedSelector,
//         expected: value
//       },
//       setStep: 0,
//     });
//     dispatch(anotherAction,{
//       on: {
//         selector: keyedSelector,
//         expected: value,
//       },
//       debounce: 5000,
//     });
// ]);
