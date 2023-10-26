import { Observable, Subject, map, switchMap, withLatestFrom } from 'rxjs';
import { Concept } from './concept';
import { UnifiedSubject } from './stagePlanner';
import { ActionController, createActionController$ } from './actionController';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector, selectUnifiedState } from './selector';
import { debounceAction, throttleAction } from './actionOperators';
import { axiumConclude } from '../concepts/axium/qualities/conclude.quality';

export type ActionType = string;
const axiumConcludeType: ActionType = 'Conclude';
type Action = {
    type: ActionType;
    semaphore: [number, number, number, number];
    payload?: unknown;
    strategy?: ActionStrategy;
    keyedSelectors?: KeyedSelector[];
    agreement?: number;
    expiration: number;
    axium?: string;
};
type Method = Observable<Action>;

export const createMethod =
  (method: (action: Action) => Action): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      map((action: Action) => {
        const methodAction = method(action);
        if (methodAction.strategy) {
          return methodAction;
        }
        const conclude = axiumConclude();
        return {
          ...action,
          ...conclude,
        };
      }),
    );
    return [defaultMethod, defaultSubject];
  };
export const createMethodWithState =
  <T>(
    methodWithState: (action: Action, state: T) => Action,
    concepts$: UnifiedSubject,
    semaphore: number
  ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore)])),
      map(([act, state] : [Action, T]) => {
        const methodAction = methodWithState(act, state);
        if (methodAction.strategy) {
          return methodAction;
        }
        const conclude = axiumConclude();
        return {
          ...act,
          ...conclude,
        };
      }),
    );
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
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodWithState =
  <T>(
    asyncMethodWithState: (controller: ActionController, action: Action, state: T) => void,
    concepts$: UnifiedSubject,
    semaphore: number
  )
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore)])),
      switchMap(([act, state] : [Action, T]) => createActionController$(act, (controller: ActionController, action: Action) => {
        asyncMethodWithState(controller, action, state);
      })),
    );
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
            return methodAction;
          }
          const conclude = axiumConclude();
          return {
            ...action,
            ...conclude,
          };
        } else {
          return action;
        }
      }),
    );
    return [defaultMethod, defaultSubject];
  };
export const createMethodDebounceWithState =
  <T>(methodWithState: (action: Action, state: T) => Action, concepts$: UnifiedSubject, semaphore: number, duration: number)
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore)])),
      map(([act, state] : [Action, T]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithState(act, state);
          if (methodAction.strategy) {
            return methodAction;
          }
          const conclude = axiumConclude();
          return {
            ...act,
            ...conclude,
          };
        } else {
          return act;
        }
      }),
    );
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
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodDebounceWithState =
  <T>(asyncMethodWithState: (controller: ActionController, action: Action, state: T) =>
    void, concepts$: UnifiedSubject, semaphore: number, duration: number, ): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore)])),
      switchMap(([act, state] : [Action, T]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
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
            return methodAction;
          }
          const conclude = axiumConclude();
          return {
            ...action,
            ...conclude,
          };
        } else {
          return action;
        }
      }),
    );
    return [defaultMethod, defaultSubject];
  };
export const createMethodThrottleWithState =
  <T>(methodWithState: (action: Action, state: T) => Action, concepts$: UnifiedSubject, semaphore: number, duration: number)
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore)])),
      map(([act, state] : [Action, T]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithState(act, state);
          if (methodAction.strategy) {
            return methodAction;
          }
          const conclude = axiumConclude();
          return {
            ...act,
            ...conclude,
          };
        } else {
          return act;
        }
      }),
    );
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
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodThrottleWithState =
  <T>(asyncMethodWithState: (controller: ActionController, action: Action, state: T) =>
    void, concepts$: UnifiedSubject, semaphore: number, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]): [Action, T] => ([act, selectUnifiedState<T>(concepts, semaphore)])),
      switchMap(([act, state] : [Action, T]) => {
        return createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
    return [defaultMethod, defaultSubject];
  };