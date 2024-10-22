/*<$
For the asynchronous graph programming framework Stratimux, define the Method Async Throttle model file.
This file holds the asynchronous throttle variant helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/

import { map, Subject, switchMap, withLatestFrom } from 'rxjs';
import { ActionDeck, Concepts, MethodCreator } from '../concept/concept.type';
import {
  Method,
  MethodAsyncParams,
  MethodAsyncWithConceptsParams,
  MethodAsyncWithStateParams,
  MethodCreatorAsyncThrottle,
  MethodCreatorAsyncThrottleWithConcepts,
  MethodCreatorAsyncThrottleWithState
} from './method.type';
import { throttleAction } from '../action/actionOperators';
import { createActionController$ } from '../action/actionController';
import { selectMuxifiedState } from '../selector/selector';

/*<#*/
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
        return createActionController$<T,C>(act, (params) => {
          asyncMethod(params);
        });
      }),
    );
    defaultMethod.toString = () => ('Async Throttle Method');
    return [defaultMethod, defaultSubject];
  };



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
/*#>*/