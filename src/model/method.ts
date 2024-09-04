/*<$
For the asynchronous graph programming framework Stratimux, define the Method model file.
This file hold a series of helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { Observable, Subject, map, switchMap, withLatestFrom } from 'rxjs';
import { Concepts, MethodCreator } from './concept';
import { ActionController, createActionController$ } from './actionController';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector, selectMuxifiedState } from './selector';
import { debounceAction, throttleAction } from './actionOperators';
import { createAction } from './action';

const axiumConclude = () => {
  return createAction('Conclude');
};

export type ActionType = string;
export type Action<T = void> = {
  type: ActionType;
  semaphore: [number, number, number, number];
  conceptSemaphore?: number;
  payload: T extends Record<string, unknown> ? T : undefined;
  strategy?: ActionStrategy;
  keyedSelectors?: KeyedSelector[];
  agreement?: number;
  expiration: number;
  priority?: number;
  axium?: string;
  origin?: string;
};
type Method<T = void> = Observable<[Action<T>, boolean]> & {toString: () => string};

type MethodCreatorBase = <S extends Record<string, unknown>, T = void>(
  method: (action: Action<T>) => Action<any>
) => MethodCreator<S, T>;

export const createMethod: MethodCreatorBase =
  <S extends Record<string, unknown>, T = void>(
    method: (action: Action<T>) => Action<any>
  ): MethodCreator<S, T> => (): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      map((action) => {
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
    ) as Method<T>;
    defaultMethod.toString = () => ('Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseWithState = <S extends Record<string, unknown>, T = void>(
  methodWithState: (action: Action<T>, state: S) => Action<any>,
) => MethodCreator<S, T>;

export const createMethodWithState: MethodCreatorBaseWithState =
  <S extends Record<string, unknown>, T = void>(
    methodWithState: (action: Action<T>, state: S) => Action<any>,
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]): [Action<T>, S] => ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      map(([act, state] : [Action<T>, S]) => {
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

type MethodCreatorBaseWithConcepts = <S extends Record<string, unknown>, T = void>(
  methodWithConcepts: (action: Action<T>, concepts: Concepts) => Action<any>,
) => MethodCreator<S, T>;

export const createMethodWithConcepts: MethodCreatorBaseWithConcepts =
  <S extends Record<string, unknown>, T = void>(
    methodWithConcepts: (action: Action<T>, concepts: Concepts) => Action<any>,
  ): MethodCreator<S, T> => ((
    concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]) => {
        const methodAction = methodWithConcepts(act, concepts);
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = axiumConclude();
        return [{
          ...act,
          ...conclude,
        }, false];
      }),
    ) as Method<T>;
    defaultMethod.toString = () => ('Method with Concepts');
    return [defaultMethod, defaultSubject];
  });

type MethodCreatorAsync = <S extends Record<string, unknown>, T = void>(
  asyncMethod: (controller: ActionController, action: Action<T>) => void
) => MethodCreator<S, T>;

export const createAsyncMethod: MethodCreatorAsync =
  <S extends Record<string, unknown>, T = void>(
    asyncMethod: (controller: ActionController, action: Action<T>) => void
  ) : MethodCreator<S, T> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      switchMap((act: Action<T>) => createActionController$(act, (controller: ActionController, action: Action<T>) => {
        asyncMethod(controller, action);
      })),
    );
    defaultMethod.toString = () => ('Async Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncWithState = <S extends Record<string, unknown>, T = void>(
  asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S) => void,
) => MethodCreator<S, T>;

export const createAsyncMethodWithState: MethodCreatorAsyncWithState =
  <S extends Record<string, unknown>, T = void>(
    asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S) => void,
  ) : MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]): [Action<T>, S] => ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      switchMap(([act, state] : [Action<T>, S]) => createActionController$(act, (controller: ActionController, action: Action<T>) => {
        asyncMethodWithState(controller, action, state);
      })),
    ) as Method<T>;
    defaultMethod.toString = () => ('Async Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounce = <S extends Record<string, unknown>, T = void>(
  method: (action: Action<T>) => Action<any>,
  duration: number
) => MethodCreator<S, T>;

export const createMethodDebounce: MethodCreatorBaseDebounce =
  <S extends Record<string, unknown>, T = void>(
    method: (action: Action<T>) => Action<any>,
    duration: number
  ): MethodCreator<S, T> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      debounceAction(duration),
      map((action: Action<T>) => {
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
    ) as Method<T>;
    defaultMethod.toString = () => ('Debounce Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounceWithState = <S extends Record<string, unknown>, T = void>(
  methodWithState: (action: Action<T>, state: S) => Action<any>,
  duration: number
) => MethodCreator<S, T>;

export const createMethodDebounceWithState: MethodCreatorBaseDebounceWithState =
  <S extends Record<string, unknown>, T = void>(
    methodWithState: (action: Action<T>, state: S) => Action<any>,
    duration: number
  ) : MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]): [Action<T>, S] => ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      map(([act, state] : [Action<T>, S]) => {
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

type MethodCreatorAsyncDebounce = <S extends Record<string, unknown>, T = void>(
  asyncMethod: (controller: ActionController, action: Action<T>) => void,
  duration: number
) => MethodCreator<S, T>;

export const createAsyncMethodDebounce: MethodCreatorAsyncDebounce =
  <S extends Record<string, unknown>, T = void>(
    asyncMethod: (controller: ActionController, action: Action<T>) => void,
    duration: number
  ): MethodCreator<S, T> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      switchMap((act) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>) => {
          asyncMethod(controller, action);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Debounce Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncDebounceWithState = <S extends Record<string, unknown>, T = void>(
  asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S) => void,
  duration: number
) => MethodCreator<S, T>;

export const createAsyncMethodDebounceWithState: MethodCreatorAsyncDebounceWithState =
  <S extends Record<string, unknown>, T = void>(
    asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S) => void,
    duration: number
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]): [Action<T>, S] => ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      switchMap(([act, state] : [Action<T>, S]) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottle = <S extends Record<string, unknown>, T = void>(
  method: (action: Action<T>) => Action<any>,
  duration: number
) => MethodCreator<S, T>;

export const createMethodThrottle: MethodCreatorBaseThrottle =
  <S extends Record<string, unknown>, T = void>(
    method: (action: Action<T>) => Action<any>,
    duration: number
  ): MethodCreator<S,T> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      map((action: Action<T>) => {
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

type MethodCreatorBaseThrottleWithState = <S extends Record<string, unknown>, T = void>(
  methodWithState: (action: Action<T>, state: S) => Action<any>,
  duration: number
) => MethodCreator<S, T>;

export const createMethodThrottleWithState: MethodCreatorBaseThrottleWithState =
  <S extends Record<string, unknown>, T = void>(
    methodWithState: (action: Action<T>, state: S) => Action<any>,
    duration: number
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]): [Action<T>, S] => ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      map(([act, state] : [Action<T>, S]) => {
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

type MethodCreatorAsyncThrottle = <S extends Record<string, unknown>, T = void>(
  asyncMethod: (controller: ActionController, action: Action<T>) => void,
  duration: number
) => MethodCreator<S, T>;

export const createAsyncMethodThrottle: MethodCreatorAsyncThrottle =
  <S extends Record<string, unknown>, T = void>(
    asyncMethod: (controller: ActionController, action: Action<T>) => void,
    duration: number
  ): MethodCreator<S, T> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      switchMap((act) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>) => {
          asyncMethod(controller, action);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Throttle Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncThrottleWithState = <S extends Record<string, unknown>, T = void>(
  asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S) => void,
  duration: number
) => MethodCreator<S, T>;

export const createAsyncMethodThrottleWithState: MethodCreatorAsyncThrottleWithState =
  <S extends Record<string, unknown>, T = void>(
    asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S) => void,
    duration: number
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]): [Action<T>, S] => ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      switchMap(([act, state] : [Action<T>, S]) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>) => {
          asyncMethodWithState(controller, action, state);
        });
      })
    );
    defaultMethod.toString = () => ('Async Throttle Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncWithConcepts= <S extends Record<string, unknown>, T = void>(
  asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number) => void,
  duration: number
) => MethodCreator<S, T>;

export const createAsyncMethodWithConcepts: MethodCreatorAsyncWithConcepts =
  <S extends Record<string, unknown>, T = void>(
    asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number) => void,
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [Action<T>, Concepts]) =>
        createActionController$(act, (controller: ActionController, action: Action<T>) => {
          asyncMethodWithConcepts(controller, action, concepts, semaphore);
        })),
    );
    defaultMethod.toString = () => ('Async Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounceWithConcepts= <S extends Record<string, unknown>, T = void>(
  methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number) => Action<any>,
  duration: number
) => MethodCreator<S, T>;

export const createMethodDebounceWithConcepts: MethodCreatorBaseDebounceWithConcepts =
  <S extends Record<string, unknown>, T = void>(
    methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number) => Action<any>,
    duration: number
  ): MethodCreator<S,T> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ) : [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]) => {
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
    ) as Method<T>;
    defaultMethod.toString = () => ('Debounce Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncDebounceWithConcepts= <S extends Record<string, unknown>, T = void>(
  asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number) => void,
  duration: number,
) => MethodCreator<S, T>;

export const createAsyncMethodDebounceWithConcepts: MethodCreatorAsyncDebounceWithConcepts =
  <S extends Record<string, unknown>, T = void>(
    asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number) => void,
    duration: number,
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [Action<T>, Concepts]) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>) => {
          asyncMethodWithConcepts(controller, action, concepts, semaphore);
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottleWithConcepts= <S extends Record<string, unknown>, T = void>(
  methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number) => Action,
  duration: number
) => MethodCreator<S, T>;

export const createMethodThrottleWithConcepts: MethodCreatorBaseThrottleWithConcepts =
  <S extends Record<string, unknown>, T = void>(
    methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number) => Action,
    duration: number
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [Action<T>, Concepts]) => {
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
    ) as Method<T>;
    defaultMethod.toString = () => ('Throttle Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncThrottleWithConcepts= <S extends Record<string, unknown>, T = void>(
  asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number) => void,
  duration: number
) => MethodCreator<S, T>;

export const createAsyncMethodThrottleWithConcepts: MethodCreatorAsyncThrottleWithConcepts =
  <S extends Record<string, unknown>, T = void>(
    asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number) => void,
    duration: number
  ): MethodCreator<S, T> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<Action<T>>] => {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [Action<T>, Concepts]) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>) => {
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
});
/*#>*/