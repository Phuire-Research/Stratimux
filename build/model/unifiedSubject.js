"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedSubject = void 0;
/* eslint-disable complexity */
const rxjs_1 = require("rxjs");
const selector_1 = require("./selector");
const handleRun = (value, stageDelimiter, staged, action, options) => {
    if (options === null || options === void 0 ? void 0 : options.on) {
        if ((0, selector_1.selectSlice)(value, options === null || options === void 0 ? void 0 : options.on.selector) === (options === null || options === void 0 ? void 0 : options.on.expected)) {
            const stageRunner = stageDelimiter.stageRunner.get(action.type + staged.step);
            if (stageRunner === undefined) {
                stageDelimiter.stageRunner.set(action.type + staged.step, true);
                return [
                    stageDelimiter, true
                ];
            }
            else {
                stageDelimiter.stageRunner.set(action.type + staged.step, false);
                return [
                    stageDelimiter, false
                ];
            }
        }
        else {
            return [
                stageDelimiter, false
            ];
        }
    }
    else if (options === null || options === void 0 ? void 0 : options.runOnce) {
        const stageRunner = stageDelimiter.stageRunner.get(action.type + staged.step);
        if (stageRunner === undefined) {
            stageDelimiter.stageRunner.set(action.type + staged.step, true);
            return [
                stageDelimiter, true
            ];
        }
        else {
            stageDelimiter.stageRunner.set(action.type + staged.step, false);
            return [
                stageDelimiter, false
            ];
        }
    }
    return [
        stageDelimiter,
        true
    ];
};
const handleStageDelimiter = (staged, action, delimiter, options) => {
    let stageDelimiter = delimiter;
    let goodAction = true;
    if (stageDelimiter &&
        stageDelimiter.prevActions.includes(action.type) &&
        (options === null || options === void 0 ? void 0 : options.debounce) === undefined) {
        if (staged.step !== (stageDelimiter === null || stageDelimiter === void 0 ? void 0 : stageDelimiter.step)) {
            stageDelimiter = {
                step: staged.step,
                prevActions: [action.type],
                unionExpiration: [action.expiration],
                stageRunner: new Map()
            };
        }
        else {
            goodAction = false;
        }
    }
    else if (stageDelimiter) {
        stageDelimiter = {
            step: staged.step,
            prevActions: [...stageDelimiter.prevActions, action.type],
            unionExpiration: [...stageDelimiter.unionExpiration, action.expiration],
            stageRunner: new Map()
        };
    }
    else {
        stageDelimiter = {
            step: staged.step,
            prevActions: [action.type],
            unionExpiration: [action.expiration],
            stageRunner: new Map()
        };
    }
    return [
        stageDelimiter,
        goodAction
    ];
};
class UnifiedSubject extends rxjs_1.Subject {
    constructor() {
        super();
        this.stageId = 0;
        this.currentStages = new Map();
        this.stageDelimiters = new Map();
    }
    stage(title, stages) {
        this.currentStages.set(this.stageId, { title, stages, step: 0, stepFailed: -1 });
        this.stageId++;
        return {
            close: () => {
                this.currentStages.delete(this.stageId);
            }
        };
    }
    next(value) {
        if (!this.closed) {
            // Need a Stage Observer that would merely deconstruct to {concepts: Concept[], dispatch: Dispatcher}
            // Where Dispatcher would be (action$: Subject<Action>) => {}();
            const axiumState = value[0].state;
            this.currentStages.forEach((staged, key) => {
                const dispatcher = (action, options) => {
                    let stageDelimiter = this.stageDelimiters.get(key);
                    let debounce = false;
                    let goodAction = true;
                    let run = true;
                    [stageDelimiter, goodAction] = handleStageDelimiter(staged, action, stageDelimiter, options);
                    [stageDelimiter, run] = handleRun(value, stageDelimiter, staged, action, options);
                    this.stageDelimiters.set(key, stageDelimiter);
                    if (goodAction && run) {
                        const action$ = axiumState.action$;
                        if ((options === null || options === void 0 ? void 0 : options.debounce) !== undefined) {
                            let previousExpiration = 0;
                            for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
                                if (stageDelimiter.prevActions[i] === action.type) {
                                    previousExpiration = stageDelimiter.unionExpiration[i];
                                    break;
                                }
                            }
                            if (previousExpiration !== action.expiration && action.expiration - previousExpiration < (options === null || options === void 0 ? void 0 : options.debounce)) {
                                debounce = true;
                            }
                            else {
                                for (let i = 0; i < stageDelimiter.prevActions.length; i++) {
                                    if (stageDelimiter.prevActions[i] === action.type) {
                                        stageDelimiter.unionExpiration[i] = action.expiration;
                                        break;
                                    }
                                }
                            }
                        }
                        this.stageDelimiters.set(key, stageDelimiter);
                        if (!debounce && run) {
                            if (options === null || options === void 0 ? void 0 : options.setStep) {
                                staged.step = options.setStep;
                            }
                            if (options === null || options === void 0 ? void 0 : options.iterateStep) {
                                staged.step += 1;
                            }
                            // Horrifying
                            if (staged.stepFailed === -1) {
                                action$.next(action);
                            }
                        }
                    }
                    else if ((options === null || options === void 0 ? void 0 : options.runOnce) === undefined) {
                        staged.stepFailed = staged.step;
                        staged.step = staged.stages.length;
                        const deleted = this.currentStages.delete(key);
                        if (deleted) {
                            axiumState.badStages.push(staged);
                        }
                    }
                };
                const index = staged.step;
                if (index < staged.stages.length) {
                    staged.stages[index](value, dispatcher);
                }
            });
        }
        const { observers } = this;
        const len = observers.length;
        for (let i = 0; i < len; i++) {
            observers[i].next(value);
        }
    }
}
exports.UnifiedSubject = UnifiedSubject;
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
