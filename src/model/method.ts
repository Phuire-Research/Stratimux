/*<$
For the asynchronous graph programming framework Stratimux, define the Method model file.
This file hold a series of helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { Observable, Subject, bufferTime, map, scan, single, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { Concepts } from './concept';
import { ActionController, createActionController$, createActionControllerForEach$ } from './actionController';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector, selectUnifiedState } from './selector';
import { debounceAction, throttleAction } from './actionOperators';
import { axiumConclude } from '../concepts/axium/qualities/conclude.quality';

export type ActionType = string;
type Action = {
    type: ActionType;
    semaphore: [number, number, number, number];
    payload?: Record<string, unknown>;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration: number;
    axium?: string;
};
type Method = Observable<[Action, boolean]> & {toString: () => string};

export const createMethod =
  (method: (action: Action) => Action): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      map((action: Action) => {
        const methodAction = method(action);
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = axiumConclude();
        return [{
          ...action,
          ...conclude,
        }, false];
      }),
    );
    defaultMethod.toString = () => ('Method');
    return [defaultMethod, defaultSubject];
  };
export const createMethodWithState =
  <T>(
    methodWithState: (action: Action, state: T) => Action,
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      map(([act, state] : [Action, T]) => {
        const methodAction = methodWithState(act, state);
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = axiumConclude();
        return [{
          ...act,
          ...conclude,
        }, false];
      }),
    );
    defaultMethod.toString = () => ('Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethod =
  (asyncMethod: (controller: ActionController, action: Action) => void): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      switchMap(act => createActionController$(act, (controller: ActionController, action: Action) => {
        asyncMethod(controller, action);
      })),
    );
    defaultMethod.toString = () => ('Async Method');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodWithState =
  <T>(
    asyncMethodWithState: (controller: ActionController, action: Action, state: T) => void,
    concepts$: Subject<Concepts>,
    semaphore: number
  )
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      switchMap(([act, state] : [Action, T]) => createActionController$(act, (controller: ActionController, action: Action) => {
        asyncMethodWithState(controller, action, state);
      })),
    );
    defaultMethod.toString = () => ('Async Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createMethodBuffer =
  (method: (action: Action) => Action, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      bufferTime(duration),
      switchMap(actions => createActionControllerForEach$(actions)),
      map((action: Action) => {
        // Logically Determined axiumConclude
        if (action.semaphore[3] !== 3) {
          const methodAction = method(action);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = axiumConclude();
          return [{
            ...action,
            ...conclude,
          }, false];
        } else {
          return [action, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Buffer Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createMethodBufferWithState =
  <T>(methodWithState:
    (action: Action, state: T) => Action, concepts$: Subject<Concepts>, semaphore: number, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      bufferTime(duration),
      switchMap(actions => createActionControllerForEach$(actions)),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      map(([act, state] : [Action, T]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithState(act, state);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = axiumConclude();
          return [{
            ...act,
            ...conclude,
          }, true];
        } else {
          return [act, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Buffer Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createMethodBufferWithConcepts =
  (
    methodWithConcepts: (action: Action, concepts: Concepts, semaphore: number) => Action, concepts$: Subject<Concepts>,
    semaphore: number,
    duration: number
  ) : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      bufferTime(duration),
      switchMap(actions => createActionControllerForEach$(actions)),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithConcepts(act, concepts, semaphore);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = axiumConclude();
          return [{
            ...act,
            ...conclude,
          }, false];
        } else {
          return [act, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Buffer Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodBuffer =
  (asyncMethod: (controller: ActionController, action: Action) => void, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      bufferTime(duration),
      switchMap(actions => createActionControllerForEach$(actions)),
      switchMap((act) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethod(controller, action);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Buffer Method');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodBufferWithState =
  <T>(asyncMethodWithState: (controller: ActionController, action: Action, state: T) =>
    void, concepts$: Subject<Concepts>, semaphore: number, duration: number, ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      bufferTime(duration),
      switchMap(actions => createActionControllerForEach$(actions)),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      switchMap(([act, state] : [Action, T]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
    defaultMethod.toString = () => ('Async Buffer Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodBufferWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concepts, semaphore: number) =>
    void, concepts$: Subject<Concepts>, semaphore: number, duration: number, ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      bufferTime(duration),
      switchMap(actions => createActionControllerForEach$(actions)),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [Action, Concepts]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithConcepts(controller, action, concepts, semaphore);
        });
      })
    );
    defaultMethod.toString = () => ('Async Buffer Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createMethodDebounce =
  (method: (action: Action) => Action, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      map((action: Action) => {
        // Logically Determined axiumConclude
        if (action.semaphore[3] !== 3) {
          const methodAction = method(action);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = axiumConclude();
          return [{
            ...action,
            ...conclude,
          }, false];
        } else {
          return [action, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Debounce Method');
    return [defaultMethod, defaultSubject];
  };
export const createMethodDebounceWithState =
  <T>(methodWithState: (action: Action, state: T) => Action, concepts$: Subject<Concepts>, semaphore: number, duration: number)
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      map(([act, state] : [Action, T]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithState(act, state);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = axiumConclude();
          return [{
            ...act,
            ...conclude,
          }, true];
        } else {
          return [act, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Debounce Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodDebounce =
  (asyncMethod: (controller: ActionController, action: Action) => void, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      switchMap((act) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethod(controller, action);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Debounce Method');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodDebounceWithState =
  <T>(asyncMethodWithState: (controller: ActionController, action: Action, state: T) =>
    void, concepts$: Subject<Concepts>, semaphore: number, duration: number, ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      switchMap(([act, state] : [Action, T]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createMethodThrottle =
  (method: (action: Action) => Action, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      map((action: Action) => {
        // Logically Determined axiumConclude
        if (action.semaphore[3] !== 3) {
          const methodAction = method(action);
          if (methodAction.strategy) {
            return [methodAction, false];
          }
          const conclude = axiumConclude();
          return [{
            ...action,
            ...conclude,
          }, false];
        } else {
          return [action, false];
        }
      }),
    );
    defaultMethod.toString = () => ('Throttle Method');
    return [defaultMethod, defaultSubject];
  };
export const createMethodThrottleWithState =
  <T>(methodWithState: (action: Action, state: T) => Action, concepts$: Subject<Concepts>, semaphore: number, duration: number)
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      map(([act, state] : [Action, T]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithState(act, state);
          if (methodAction.strategy) {
            return [methodAction, false];
          }
          const conclude = axiumConclude();
          return [{
            ...act,
            ...conclude,
          }, false];
        } else {
          return [act, false];
        }
      }),
    );
    defaultMethod.toString = () => ('Throttle Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodThrottle =
  (asyncMethod: (controller: ActionController, action: Action) => void, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      switchMap((act) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethod(controller, action);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Throttle Method');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodThrottleWithState =
  <T>(asyncMethodWithState: (controller: ActionController, action: Action, state: T) =>
    void, concepts$: Subject<Concepts>, semaphore: number, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore) as T])),
      switchMap(([act, state] : [Action, T]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
    defaultMethod.toString = () => ('Async Throttle Method with State');
    return [defaultMethod, defaultSubject];
  };
export const createMethodWithConcepts =
  (
    methodWithConcepts: (action: Action, concepts: Concepts, semaphore: number) => Action,
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]) => {
        const methodAction = methodWithConcepts(act, concepts, semaphore);
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = axiumConclude();
        return [{
          ...act,
          ...conclude,
        }, false];
      }),
    );
    defaultMethod.toString = () => ('Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodWithConcepts =
  (
    asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concepts, semaphore: number) => void,
    concepts$: Subject<Concepts>,
    semaphore: number
  )
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$ ),
      switchMap(([act, concepts] : [Action, Concepts]) => createActionController$(act, (controller: ActionController, action: Action) => {
        asyncMethodWithConcepts(controller, action, concepts, semaphore);
      })),
    );
    defaultMethod.toString = () => ('Async Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createMethodDebounceWithConcepts =
  (
    methodWithConcepts: (action: Action, concepts: Concepts, semaphore: number) => Action, concepts$: Subject<Concepts>,
    semaphore: number,
    duration: number
  ) : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithConcepts(act, concepts, semaphore);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = axiumConclude();
          return [{
            ...act,
            ...conclude,
          }, false];
        } else {
          return [act, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Debounce Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodDebounceWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concepts, semaphore: number) =>
    void, concepts$: Subject<Concepts>, semaphore: number, duration: number, ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [Action, Concepts]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithConcepts(controller, action, concepts, semaphore);
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createMethodThrottleWithConcepts =
  (
    methodWithConcepts: (action: Action, concepts: Concepts, semaphore: number) => Action,
    concepts$: Subject<Concepts>,
    semaphore: number,
    duration: number
  ) : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action, Concepts]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithConcepts(act, concepts, semaphore);
          if (methodAction.strategy) {
            return [methodAction, false];
          }
          const conclude = axiumConclude();
          return [{
            ...act,
            ...conclude,
          }, false];
        } else {
          return [act, false];
        }
      }),
    );
    defaultMethod.toString = () => ('Throttle Method with Concepts');
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodThrottleWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concepts, semaphore: number) =>
    void, concepts$: Subject<Concepts>, semaphore: number, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [Action, Concepts]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithConcepts(controller, action, concepts, semaphore);
        });
      })
    );
    defaultMethod.toString = () => ('Async Throttle Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

export const method = ({
  create: createMethod,
  createWithState: createMethodWithState,
  createWithConcepts: createMethodWithConcepts,
  createDebounce: createMethodDebounce,
  createDebounceWithState: createMethodDebounceWithState,
  createDebounceWithConcepts: createMethodDebounceWithConcepts,
  createThrottle: createMethodThrottle,
  createThrottleWithState: createMethodThrottleWithState,
  createThrottleWithConcepts: createMethodThrottleWithConcepts,
  createAsync: createAsyncMethod,
  createAsyncDebounce: createAsyncMethodDebounce,
  createAsyncDebounceWithState: createAsyncMethodDebounceWithState,
  createAsyncDebounceWithConcepts: createAsyncMethodDebounceWithConcepts,
  createAsyncThrottle: createAsyncMethodThrottle,
  createAsyncThrottleWithState: createAsyncMethodThrottleWithState,
  createAsyncThrottleWithConcepts: createAsyncMethodThrottleWithConcepts,
  createBuffer: createMethodBuffer,
  createBufferWithState: createMethodBufferWithState,
  createMethodBufferWithConcepts: createMethodBufferWithConcepts,
  createAsyncBuffer: createAsyncMethodBuffer,
  createAsyncBufferWithState: createAsyncMethodBufferWithState,
  createAsyncBufferWithConcepts: createAsyncMethodBufferWithConcepts
});
/*#>*/