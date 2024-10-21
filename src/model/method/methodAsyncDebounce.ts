/*<$
For the asynchronous graph programming framework Stratimux, define the Method Async Debounce model file.
This file holds the asynchronous debounce variant helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/

import { map, Subject, switchMap, withLatestFrom } from 'rxjs';
import { ActionDeck, Concepts, MethodCreator } from '../concept';
import {
  Method,
  MethodAsyncParams,
  MethodAsyncWithConceptsParams,
  MethodAsyncWithStateParams,
  MethodCreatorAsyncDebounce,
  MethodCreatorAsyncDebounceWithConcepts,
  MethodCreatorAsyncDebounceWithState
} from './method.type';
import { debounceAction } from '../action/actionOperators';
import { createActionController$ } from '../action/actionController';
import { selectMuxifiedState } from '../selector';

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

/*#>*/