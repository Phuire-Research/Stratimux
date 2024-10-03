/*<$
For the asynchronous graph programming framework Stratimux, define the Method model file.
This file hold a series of helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { Observable, Subject, map, switchMap, withLatestFrom } from 'rxjs';
import { ActionDeck, Concepts, MethodCreator } from './concept';
import { ActionController, createActionController$ } from './actionController';
import { ActionStrategy } from './actionStrategy';
import { KeyedSelector, selectMuxifiedState } from './selector';
import { debounceAction, throttleAction } from './actionOperators';
import { ActionCreator, ActionCreatorWithPayload, createAction } from './action';
import { Deck } from './deck';

const muxiumConclude = () => {
  return createAction('Conclude');
};

// DETERMINED IMPORT OF ACTION FROM action.ts
type ActionType = string;
type Action<T = void> = {
  type: ActionType;
  semaphore: [number, number, number, number];
  conceptSemaphore?: number;
  payload: T extends Record<string, unknown> ? T : undefined;
  strategy?: ActionStrategy;
  keyedSelectors?: KeyedSelector[];
  agreement?: number;
  expiration: number;
  priority?: number;
  muxium?: string;
  origin?: string;
};
type Method<T = void> = Observable<[Action<T>, boolean]> & {toString: () => string};

type MethodParams<T = void, C = void> = {
  action: Action<T>, deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

type MethodCreatorBase = <S extends Record<string, unknown>, T = void, C = void>(
  method: (params: MethodParams<T,C>) => Action<any>
) => MethodCreator<S, T, C>;

export const createMethod: MethodCreatorBase =
  <S extends Record<string, unknown>, T = void, C = void>(
    method: (params: MethodParams<T,C>) => Action<any>
  ): MethodCreator<S, T, C> => (): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      map(({action, deck, self}) => {
        defaultMethod.toString = () => ('Method: ' + action.type);
        const methodAction = method({action, deck, self});
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = muxiumConclude();
        return [{
          ...action,
          ...conclude,
        }, false];
      }),
    ) as Method<T>;
    defaultMethod.toString = () => ('Method');
    return [defaultMethod, defaultSubject];
  };

type MethodWithStateParams<S extends Record<string, unknown>, T = void, C = void> = {
  action: Action<T>, state: S, deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

type MethodCreatorBaseWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
) => MethodCreator<S, T, C>;

export const createMethodWithState: MethodCreatorBaseWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
  ): MethodCreator<S, T, C> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]): [ActionDeck<T, C>, S] =>
        ([act, selectMuxifiedState<S>(concepts, semaphore) as S])
      ),
      map(([act, state] : [ActionDeck<T, C>, S]) => {
        const {action, deck, self} = act;
        defaultMethod.toString = () => ('Method with State: ' + action.type);
        const methodAction = methodWithState({action, state, deck, self});
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = muxiumConclude();
        return [{
          ...act,
          ...conclude,
        }, false];
      }),
    );
    defaultMethod.toString = () => ('Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodWithConceptsParams<T = void, C = void> = {
  action: Action<T>,
  concepts_: Concepts,
  semaphore: number,
  deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

type MethodCreatorBaseWithConcepts = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action<any>,
) => MethodCreator<S, T, C>;

export const createMethodWithConcepts: MethodCreatorBaseWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action<any>,
  ): MethodCreator<S, T, C> => ((
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]) => {
        const { action, deck, self } = act;
        defaultMethod.toString = () => ('Method with Concepts: ' + action.type); const methodAction = methodWithConcepts({action, concepts_: concepts, deck, self, semaphore});
        if (methodAction.strategy) {
          return [methodAction, false];
        }
        const conclude = muxiumConclude();
        return [{
          ...act,
          ...conclude,
        }, false];
      }),
    ) as Method<T>;
    defaultMethod.toString = () => ('Method with Concepts');
    return [defaultMethod, defaultSubject];
  });

type MethodAsyncParams<T = void, C = void> = {
  action: Action<T>, controller: ActionController, deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}
type MethodCreatorAsync = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (params: MethodAsyncParams<T,C>) => void
) => MethodCreator<S, T, C>;

export const createAsyncMethod: MethodCreatorAsync =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethod: (params: MethodAsyncParams<T,C>) => void
  ) : MethodCreator<S, T, C> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      switchMap((act: ActionDeck<T, C>) => createActionController$(act, (
        params
      ) => {
        defaultMethod.toString = () => ('Async Method: ' + act.action.type);
        asyncMethod(params);
      })),
    );
    defaultMethod.toString = () => ('Async Method');
    return [defaultMethod, defaultSubject];
  };

type MethodAsyncWithStateParams<S extends Record<string, unknown>, T = void, C = void> = {
  action: Action<T>,
  state: S,
  deck: Deck<C>,
  controller: ActionController,
  self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

type MethodCreatorAsyncWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (params: MethodAsyncWithStateParams<S, T, C>) => void,
) => MethodCreator<S, T, any>;

export const createAsyncMethodWithState: MethodCreatorAsyncWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithState: (params: MethodAsyncWithStateParams<S, T, C>) => void,
  ) : MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ) : [Method<T>, Subject<ActionDeck<T,C>>] => {
    const defaultSubject = new Subject<ActionDeck<T,C>>();
    const defaultMethod = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(
        ([act, concepts] : [ActionDeck<T,C>, Concepts]): [ActionDeck<T,C>, S] =>
          ([act, selectMuxifiedState<S>(concepts, semaphore) as S])
      ),
      switchMap(
        ([act, state] : [ActionDeck<T, C>, S]) => {
          return createActionController$(act, (params) => {
            defaultMethod.toString = () => ('Async Method with State: ' + params.action.type);
            asyncMethodWithState({...params, state});
          });
        }),
    ) as Method<T>;
    defaultMethod.toString = () => ('Async Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounce = <S extends Record<string, unknown>, T = void, C = void>(
  method: (params: MethodParams<T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export const createMethodDebounce: MethodCreatorBaseDebounce =
  <S extends Record<string, unknown>, T = void, C = void>(
    method: (params: MethodParams<T,C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, any> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      debounceAction(duration),
      map((act: ActionDeck<T, C>) => {
        // Logically Determined muxiumConclude
        if (act.action.semaphore[3] !== 3) {
          defaultMethod.toString = () => ('Debounce Method: ' + act.action.type);
          const methodAction = method(act);
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = muxiumConclude();
          return [{
            ...act.action,
            ...conclude,
          }, false];
        } else {
          return [act.action, true];
        }
      }),
    ) as Method<T>;
    defaultMethod.toString = () => ('Debounce Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounceWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (params: MethodWithStateParams<S, T, C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export const createMethodDebounceWithState: MethodCreatorBaseDebounceWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
    duration: number
  ) : MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]): [ActionDeck<T,C>, S] =>
        ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      map(([act, state] : [ActionDeck<T,C>, S]) => {
        // Logically Determined muxiumConclude
        if (act.action.semaphore[3] !== 3) {
          const methodAction = methodWithState({...act, state});
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = muxiumConclude();
          return [{
            ...act.action,
            ...conclude,
          }, true];
        } else {
          return [act.action, true];
        }
      }),
    );
    defaultMethod.toString = () => ('Debounce Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncDebounce = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (params: MethodAsyncParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export const createAsyncMethodDebounce: MethodCreatorAsyncDebounce =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethod: (params: MethodAsyncParams<T,C>) => void,
    duration: number
  ): MethodCreator<S, T, any> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      switchMap((act) => {
        defaultMethod.toString = () => ('Async Debounce Method: ' + act.action.type);
        return createActionController$(act, (params) => {
          asyncMethod(params);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Debounce Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncDebounceWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (params: MethodAsyncWithStateParams<S,T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export const createAsyncMethodDebounceWithState: MethodCreatorAsyncDebounceWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithState: (params: MethodAsyncWithStateParams<S,T,C>) => void,
    duration: number
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]): [ActionDeck<T,C>, S] =>
        ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      switchMap(([act, state] : [ActionDeck<T, C>, S]) => {
        defaultMethod.toString = () => ('Async Debounce Method with State: ' + act.action.type);
        return createActionController$(act, (params) => {
          asyncMethodWithState({...params, state});
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottle = <S extends Record<string, unknown>, T = void, C = void>(
  method: (params: MethodParams<T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export const createMethodThrottle: MethodCreatorBaseThrottle =
  <S extends Record<string, unknown>, T = void, C = void>(
    method: (params: MethodParams<T,C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, any> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T,C>>] => {
    const defaultSubject = new Subject<ActionDeck<T,C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      map((act: ActionDeck<T,C>) => {
        // Logically Determined muxiumConclude
        if (act.action.semaphore[3] !== 3) {
          defaultMethod.toString = () => ('Throttle Method: ' + act.action.type);
          const methodAction = method(act);
          if (methodAction.strategy) {
            return [methodAction, false];
          }
          const conclude = muxiumConclude();
          return [{
            ...act.action,
            ...conclude,
          }, false];
        } else {
          return [act.action, false];
        }
      }),
    );
    defaultMethod.toString = () => ('Throttle Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottleWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export const createMethodThrottleWithState: MethodCreatorBaseThrottleWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithState: (params: MethodWithStateParams<S,T,C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]): [ActionDeck<T, C>, S] =>
        ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      map(([act, state] : [ActionDeck<T, C>, S]) => {
        // Logically Determined muxiumConclude
        if (act.action.semaphore[3] !== 3) {
          defaultMethod.toString = () => ('Throttle Method with State: ' + act.action.type);
          const methodAction = methodWithState({...act, state});
          if (methodAction.strategy) {
            return [methodAction, false];
          }
          const conclude = muxiumConclude();
          return [{
            ...act.action,
            ...conclude,
          }, false];
        } else {
          return [act.action, false];
        }
      }),
    );
    defaultMethod.toString = () => ('Throttle Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncThrottle = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (params: MethodAsyncParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export const createAsyncMethodThrottle: MethodCreatorAsyncThrottle =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethod: (params: MethodAsyncParams<T,C>) => void,
    duration: number
  ): MethodCreator<S, T, any> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      switchMap((act) => {
        defaultMethod.toString = () => ('Async Throttle Method: ' + act.action.type);
        return createActionController$(act, (params) => {
          asyncMethod(params);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Throttle Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncThrottleWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (params: MethodAsyncWithStateParams<S,T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export const createAsyncMethodThrottleWithState: MethodCreatorAsyncThrottleWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithState: (params: MethodAsyncWithStateParams<S,T,C>) => void,
    duration: number
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]): [ActionDeck<T, C>, S] =>
        ([act, selectMuxifiedState<S>(concepts, semaphore) as S])),
      switchMap(([act, state] : [ActionDeck<T, C>, S]) => {
        defaultMethod.toString = () => ('Async Throttle Method with State: ' + act.action.type);
        return createActionController$(act, (params) => {
          asyncMethodWithState({...params, state});
        });
      })
    );
    defaultMethod.toString = () => ('Async Throttle Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodAsyncWithConceptsParams<T = void, C = void> = {
  action: Action<T>,
  controller: ActionController,
  concepts_: Concepts,
  semaphore: number,
  deck: Deck<C>, self: T extends void ?
    ActionCreator
    :
    ActionCreatorWithPayload<T extends Record<string, unknown> ? T : Record<string, unknown>>;
}

type MethodCreatorAsyncWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (params: MethodAsyncWithConceptsParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export const createAsyncMethodWithConcepts: MethodCreatorAsyncWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithConcepts: (
      params: MethodAsyncWithConceptsParams<T, C>
    ) => void,
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      withLatestFrom(concepts$),
      switchMap(([act, concepts]: [ActionDeck<T, C>, Concepts]) =>
        createActionController$(act, (params) => {
          defaultMethod.toString = () => ('Async Method with Concepts: ' + act.action.type);
          asyncMethodWithConcepts({...params, concepts_: concepts, semaphore});
        })),
    );
    defaultMethod.toString = () => ('Async Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounceWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, any>;

export const createMethodDebounceWithConcepts: MethodCreatorBaseDebounceWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]) => {
        // Logically Determined muxiumConclude
        if (act.action.semaphore[3] !== 3) {
          defaultMethod.toString = () => ('Debounce Method with Concepts: ' + act.action.type);
          const methodAction = methodWithConcepts({...act, concepts_: concepts, semaphore});
          if (methodAction.strategy) {
            return [methodAction, true];
          }
          const conclude = muxiumConclude();
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

type MethodCreatorAsyncDebounceWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (params: MethodAsyncWithConceptsParams<T,C>) => void,
  duration: number,
) => MethodCreator<S, T, any>;

export const createAsyncMethodDebounceWithConcepts: MethodCreatorAsyncDebounceWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithConcepts: (
      params: MethodAsyncWithConceptsParams<T,C>
    ) => void,
    duration: number,
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [ActionDeck<T, C>, Concepts]) => {
        defaultMethod.toString = () => ('Async Debounce Method with Concepts: ' + act.action.type);
        return createActionController$(act, (params) => {
          asyncMethodWithConcepts({...params, concepts_: concepts, semaphore });
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottleWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action,
  duration: number
) => MethodCreator<S, T, any>;

export const createMethodThrottleWithConcepts: MethodCreatorBaseThrottleWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithConcepts: (params: MethodWithConceptsParams<T,C>) => Action,
    duration: number
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T,C>>();
    const defaultMethod = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T,C>, Concepts]) => {
        // Logically Determined muxiumConclude
        if (act.action.semaphore[3] !== 3) {
          defaultMethod.toString = () => ('Throttle Method with Concepts: ' + act.action.type);
          const methodAction = methodWithConcepts({...act, concepts_: concepts, semaphore});
          if (methodAction.strategy) {
            return [methodAction, false];
          }
          const conclude = muxiumConclude();
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

type MethodCreatorAsyncThrottleWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (params: MethodAsyncWithConceptsParams<T,C>) => void,
  duration: number
) => MethodCreator<S, T, any>;

export const createAsyncMethodThrottleWithConcepts: MethodCreatorAsyncThrottleWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithConcepts: (
      params: MethodAsyncWithConceptsParams<T,C>
    ) => void,
    duration: number
  ): MethodCreator<S, T, any> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [ActionDeck<T,C>, Concepts]) => {
        return createActionController$(act, (params) => {
          defaultMethod.toString = () => ('Async Throttle Method with Concepts: ' + act.action.type);
          asyncMethodWithConcepts({...params, concepts_: concepts, semaphore});
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