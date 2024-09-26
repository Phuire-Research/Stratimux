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
import { createAction } from './action';
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

type MethodCreatorBase = <S extends Record<string, unknown>, T = void, C = void>(
  method: (action: Action<T>, deck: Deck<C>) => Action<any>
) => MethodCreator<S, T, C>;

export const createMethod: MethodCreatorBase =
  <S extends Record<string, unknown>, T = void, C = void>(
    method: (action: Action<T>, deck: Deck<C>) => Action<any>
  ): MethodCreator<S, T, C> => (): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      map(({action, deck}) => {
        defaultMethod.toString = () => ('Method: ' + action.type);
        const methodAction = method(action, deck);
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

type MethodCreatorBaseWithState = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithState: (action: Action<T>, state: S, deck: Deck<C>) => Action<any>,
) => MethodCreator<S, T, C>;

export const createMethodWithState: MethodCreatorBaseWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithState: (action: Action<T>, state: S, deck: Deck<C>) => Action<any>,
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
        const {action, deck} = act;
        defaultMethod.toString = () => ('Method with State: ' + action.type);
        const methodAction = methodWithState(action, state, deck);
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

type MethodCreatorBaseWithConcepts = <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (action: Action<T>, concepts: Concepts, deck: Deck<C>) => Action<any>,
) => MethodCreator<S, T, C>;

export const createMethodWithConcepts: MethodCreatorBaseWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithConcepts: (action: Action<T>, concepts: Concepts, deck: Deck<C>) => Action<any>,
  ): MethodCreator<S, T, C> => ((
    concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      withLatestFrom(concepts$),
      map(([act, concepts] : [ActionDeck<T, C>, Concepts]) => {
        const { action, deck } = act;
        defaultMethod.toString = () => ('Method with Concepts: ' + action.type);
        const methodAction = methodWithConcepts(action, concepts, deck);
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

type MethodCreatorAsync = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethod: (controller: ActionController, action: Action<T>, deck: Deck<C>) => void
) => MethodCreator<S, T, C>;

export const createAsyncMethod: MethodCreatorAsync =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethod: (controller: ActionController, action: Action<T>, deck: Deck<C>) => void
  ) : MethodCreator<S, T, C> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ) : [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      switchMap((act: ActionDeck<T, C>) => createActionController$(act, (
        controller: ActionController, action: Action<T>, deck: Deck<C>
      ) => {
        defaultMethod.toString = () => ('Async Method: ' + act.action.type);
        asyncMethod(controller, action, deck);
      })),
    );
    defaultMethod.toString = () => ('Async Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S, deck: Deck<C>) => void,
) => MethodCreator<S, T, C>;

export const createAsyncMethodWithState: MethodCreatorAsyncWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S, deck: Deck<C>) => void,
  ) : MethodCreator<S, T, C> => (
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
          return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
            defaultMethod.toString = () => ('Async Method with State: ' + action.type);
            asyncMethodWithState(controller, action, state, deck);
          });
        }),
    ) as Method<T>;
    defaultMethod.toString = () => ('Async Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounce = <S extends Record<string, unknown>, T = void, C = void>(
  method: (action: Action<T>) => Action<any>,
  duration: number
) => MethodCreator<S, T, C>;

export const createMethodDebounce: MethodCreatorBaseDebounce =
  <S extends Record<string, unknown>, T = void, C = void>(
    method: (action: Action<T>, deck: Deck<C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, C> => (
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
          const methodAction = method(act.action, act.deck);
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
  methodWithState: (action: Action<T>, state: S, deck: Deck<C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, C>;

export const createMethodDebounceWithState: MethodCreatorBaseDebounceWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithState: (action: Action<T>, state: S, deck: Deck<C>) => Action<any>,
    duration: number
  ) : MethodCreator<S, T, C> => (
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
          const methodAction = methodWithState(act.action, state, act.deck);
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
  asyncMethod: (controller: ActionController, action: Action<T>, deck: Deck<C>) => void,
  duration: number
) => MethodCreator<S, T, C>;

export const createAsyncMethodDebounce: MethodCreatorAsyncDebounce =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethod: (controller: ActionController, action: Action<T>, deck: Deck<C>) => void,
    duration: number
  ): MethodCreator<S, T, C> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      switchMap((act) => {
        defaultMethod.toString = () => ('Async Debounce Method: ' + act.action.type);
        return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          asyncMethod(controller, action, deck);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Debounce Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncDebounceWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S, deck: Deck<C>) => void,
  duration: number
) => MethodCreator<S, T, C>;

export const createAsyncMethodDebounceWithState: MethodCreatorAsyncDebounceWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S, deck: Deck<C>) => void,
    duration: number
  ): MethodCreator<S, T, C> => (
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
        return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          asyncMethodWithState(controller, action, state, deck);
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottle = <S extends Record<string, unknown>, T = void, C = void>(
  method: (action: Action<T>, deck: Deck<C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, C>;

export const createMethodThrottle: MethodCreatorBaseThrottle =
  <S extends Record<string, unknown>, T = void, C = void>(
    method: (action: Action<T>, deck: Deck<C>) => Action<any>,
    duration: number
  ): MethodCreator<S,T,C> => (
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
          const methodAction = method(act.action, act.deck);
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
  methodWithState: (action: Action<T>, state: S, deck: Deck<C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, C>;

export const createMethodThrottleWithState: MethodCreatorBaseThrottleWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithState: (action: Action<T>, state: S, deck: Deck<C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, C> => (
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
          const methodAction = methodWithState(act.action, state, act.deck);
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
  asyncMethod: (controller: ActionController, action: Action<T>, deck: Deck<C>) => void,
  duration: number
) => MethodCreator<S, T, C>;

export const createAsyncMethodThrottle: MethodCreatorAsyncThrottle =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethod: (controller: ActionController, action: Action<T>, deck: Deck<C>) => void,
    duration: number
  ): MethodCreator<S, T, C> => (
    _concepts$: Subject<Concepts>,
    _semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      switchMap((act) => {
        defaultMethod.toString = () => ('Async Throttle Method: ' + act.action.type);
        return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          asyncMethod(controller, action, deck);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Throttle Method');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncThrottleWithState = <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S, deck: Deck<C>) => void,
  duration: number
) => MethodCreator<S, T, C>;

export const createAsyncMethodThrottleWithState: MethodCreatorAsyncThrottleWithState =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithState: (controller: ActionController, action: Action<T>, state: S, deck: Deck<C>) => void,
    duration: number
  ): MethodCreator<S, T, C> => (
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
        return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          asyncMethodWithState(controller, action, state, deck);
        });
      })
    );
    defaultMethod.toString = () => ('Async Throttle Method with State');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorAsyncWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => void,
  duration: number
) => MethodCreator<S, T, C>;

export const createAsyncMethodWithConcepts: MethodCreatorAsyncWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithConcepts: (
      controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>
    ) => void,
  ): MethodCreator<S, T, C> => (
    concepts$: Subject<Concepts>,
    semaphore: number
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [ActionDeck<T, C>, Concepts]) =>
        createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          defaultMethod.toString = () => ('Async Method with Concepts: ' + action.type);
          asyncMethodWithConcepts(controller, action, concepts, semaphore, deck);
        })),
    );
    defaultMethod.toString = () => ('Async Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseDebounceWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => Action<any>,
  duration: number
) => MethodCreator<S, T, C>;

export const createMethodDebounceWithConcepts: MethodCreatorBaseDebounceWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => Action<any>,
    duration: number
  ): MethodCreator<S, T, C> => (
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
          const methodAction = methodWithConcepts(act.action, concepts, semaphore, act.deck);
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
  asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => void,
  duration: number,
) => MethodCreator<S, T, C>;

export const createAsyncMethodDebounceWithConcepts: MethodCreatorAsyncDebounceWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithConcepts: (
      controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>
    ) => void,
    duration: number,
  ): MethodCreator<S, T, C> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      debounceAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [ActionDeck<T, C>, Concepts]) => {
        defaultMethod.toString = () => ('Async Debounce Method with Concepts: ' + act.action.type);
        return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          asyncMethodWithConcepts(controller, action, concepts, semaphore, deck);
        });
      })
    );
    defaultMethod.toString = () => ('Async Debounce Method with Concepts');
    return [defaultMethod, defaultSubject];
  };

type MethodCreatorBaseThrottleWithConcepts= <S extends Record<string, unknown>, T = void, C = void>(
  methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => Action,
  duration: number
) => MethodCreator<S, T, C>;

export const createMethodThrottleWithConcepts: MethodCreatorBaseThrottleWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    methodWithConcepts: (action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => Action,
    duration: number
  ): MethodCreator<S, T, C> => (
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
          const methodAction = methodWithConcepts(act.action, concepts, semaphore, act.deck);
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
  asyncMethodWithConcepts: (controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>) => void,
  duration: number
) => MethodCreator<S, T, C>;

export const createAsyncMethodThrottleWithConcepts: MethodCreatorAsyncThrottleWithConcepts =
  <S extends Record<string, unknown>, T = void, C = void>(
    asyncMethodWithConcepts: (
      controller: ActionController, action: Action<T>, concepts: Concepts, semaphore: number, deck: Deck<C>
    ) => void,
    duration: number
  ): MethodCreator<S, T, C> => (
    concepts$: Subject<Concepts>,
    semaphore: number,
  ): [Method<T>, Subject<ActionDeck<T, C>>] => {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod: Method<T> = defaultSubject.pipe(
      throttleAction(duration),
      withLatestFrom(concepts$),
      switchMap(([act, concepts] : [ActionDeck<T,C>, Concepts]) => {
        return createActionController$(act, (controller: ActionController, action: Action<T>, deck: Deck<C>) => {
          defaultMethod.toString = () => ('Async Throttle Method with Concepts: ' + act.action.type);
          asyncMethodWithConcepts(controller, action, concepts, semaphore, deck);
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