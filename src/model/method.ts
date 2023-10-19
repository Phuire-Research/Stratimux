import { Observable, Subject, map, switchMap, withLatestFrom } from 'rxjs';
import { Concept } from './concept';
import { UnifiedSubject } from './stagePlanner';
import { ActionController, createActionController$ } from './actionController';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector } from './selector';
import { debounceAction } from './debounceAction';

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
        return {
          ...action,
          type: axiumConcludeType
        };
      }),
    );
    return [defaultMethod, defaultSubject];
  };
export const createMethodWithConcepts =
  (method: (action: Action) => Action, concepts$: UnifiedSubject): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]) => {
        const methodAction = method(act);
        if (methodAction.strategy) {
          return methodAction;
        }
        return {
          ...act,
          type: axiumConcludeType
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
export const createAsyncMethodWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concept[]) => void, concepts$: UnifiedSubject)
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      withLatestFrom(concepts$ as UnifiedSubject),
      switchMap(([act, concepts] : [Action, Concept[]]) =>
        createActionController$(act, (controller: ActionController, action: Action) => {
          asyncMethodWithConcepts(controller, action, concepts);
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
          return {
            ...action,
            type: axiumConcludeType
          };
        } else {
          return action;
        }
      }),
    );
    return [defaultMethod, defaultSubject];
  };
export const createMethodDebounceWithConcepts =
  (methodWithConcepts: (action: Action, concepts: Concept[]) => Action, concepts$: UnifiedSubject, duration: number)
    : [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$ as UnifiedSubject),
      map(([act, concepts] : [Action, Concept[]]) => {
        // Logically Determined axiumConclude
        if (act.semaphore[3] !== 3) {
          const methodAction = methodWithConcepts(act, concepts);
          if (methodAction.strategy) {
            return methodAction;
          }
          return {
            ...act,
            type: axiumConcludeType
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
        if (act.semaphore[3] !== 3) {
          return createActionController$(act, (controller: ActionController, action: Action) => {
            asyncMethod(controller, action);
          });
        } else {
          return createActionController$(act, (controller: ActionController, _) => {
            controller.fire(act);
          });
        }
      }),
    );
    return [defaultMethod, defaultSubject];
  };
export const createAsyncMethodDebounceWithConcepts =
  (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concept[]) =>
    void, concepts$: UnifiedSubject, duration: number): [Method, Subject<Action>] => {
    const defaultSubject = new Subject<Action>();
    const defaultMethod: Method = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$ as UnifiedSubject),
      switchMap(([act, concepts] : [Action, Concept[]]) => {
        if (act.semaphore[3] !== 3) {
          return createActionController$(act, (controller: ActionController, action: Action) => {
            asyncMethodWithConcepts(controller, action, concepts);
          });
        } else {
          return createActionController$(act, (controller: ActionController, _) => {
            controller.fire(act);
          });
        }
      })
    );
    return [defaultMethod, defaultSubject];
  };