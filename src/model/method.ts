import { Observable, Subject, debounceTime, map, switchMap, withLatestFrom } from 'rxjs';
import { Concept } from './concept';
import { UnifiedSubject } from './stagePlanner';
import { ActionController, createActionController$ } from './actionController';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector } from './selector';
import { createExperimentConcept, createExperimentState } from '../concepts/experiment/experiment.concept';

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
// export const createMethodDebounce =
//   (method: (action: Action) => Action, duration: number): [Method, Subject<Action>] => {
//     const defaultSubject = new Subject<Action>();
//     const defaultMethod: Method = defaultSubject.pipe(
//       debounceTime(duration),
//       map((action: Action) => {
//         const methodAction = method(action);
//         if (methodAction.strategy) {
//           return methodAction;
//         }
//         return {
//           ...action,
//           type: axiumConcludeType
//         };
//       }),
//     );
//     return [defaultMethod, defaultSubject];
//   };
// export const createMethodDebounceWithConcepts =
//   (methodWithConcepts: (action: Action, concepts: Concept[]) => Action, concepts$: UnifiedSubject, duration: number)
//     : [Method, Subject<Action>] => {
//     const defaultSubject = new Subject<Action>();
//     const defaultMethod: Method = defaultSubject.pipe(
//       debounceTime(duration),
//       withLatestFrom(concepts$ as UnifiedSubject),
//       map(([act, concepts] : [Action, Concept[]]) => {
//         const methodAction = methodWithConcepts(act, concepts);
//         if (methodAction.strategy) {
//           return methodAction;
//         }
//         return {
//           ...act,
//           type: axiumConcludeType
//         };
//       }),
//     );
//     return [defaultMethod, defaultSubject];
//   };
// export const createAsyncMethodDebounce =
//   (asyncMethod: (controller: ActionController, action: Action) => void, duration: number): [Method, Subject<Action>] => {
//     const defaultSubject = new Subject<Action>();
//     const defaultMethod: Method = defaultSubject.pipe(
//       debounceTime(duration),
//       switchMap(act => createActionController$(act, (controller: ActionController, action: Action) => {
//         asyncMethod(controller, action);
//       })),
//     );
//     return [defaultMethod, defaultSubject];
//   };
// export const createAsyncMethodDebounceWithConcepts =
//   (asyncMethodWithConcepts: (controller: ActionController, action: Action, concepts: Concept[]) =>
//     void, concepts$: UnifiedSubject, duration: number): [Method, Subject<Action>] => {
//     const defaultSubject = new Subject<Action>();
//     const defaultMethod: Method = defaultSubject.pipe(
//       debounceTime(duration),
//       withLatestFrom(concepts$ as UnifiedSubject),
//       switchMap(([act, concepts] : [Action, Concept[]]) =>
//         createActionController$(act, (controller: ActionController, action: Action) => {
//           asyncMethodWithConcepts(controller, action, concepts);
//         })),
//     );
//     return [defaultMethod, defaultSubject];
//   };