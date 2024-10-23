/*<$
For the asynchronous graph programming framework Stratimux, define the Method model file.
This file hold a series of helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { Subject, map, withLatestFrom } from 'rxjs';
import { ActionDeck, Concepts, Method, MethodCreator } from '../concept/concept.type';
import { selectMuxifiedState } from '../selector/selector';
import { createAction } from '../action/action';
import { Action } from '../action/action.type';
import {
  MethodCreatorBase,
  MethodCreatorBaseWithConcepts,
  MethodCreatorBaseWithState,
  MethodParams,
  MethodWithConceptsParams,
  MethodWithStateParams
} from './method.type';

const muxiumConclude = () => {
  return createAction('Conclude');
};

// DETERMINED IMPORT OF ACTION FROM action.ts

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
        defaultMethod.toString = () => ('Method with Concepts: ' + action.type);
        const methodAction = methodWithConcepts({action, concepts_: concepts, deck, self, semaphore});
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

/*#>*/