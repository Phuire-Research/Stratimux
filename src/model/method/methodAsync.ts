/*<$
For the asynchronous graph programming framework Stratimux, define the Method Async model file.
This file holds the base asynchronous helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { map, Subject, switchMap, withLatestFrom } from 'rxjs';
import { ActionDeck, Concepts, MethodCreator } from '../concept/concept';
import {
  Method,
  MethodAsyncParams,
  MethodAsyncWithConceptsParams,
  MethodAsyncWithStateParams,
  MethodCreatorAsync,
  MethodCreatorAsyncWithConcepts,
  MethodCreatorAsyncWithState
} from './method.type';
import { createActionController$ } from '../action/actionController';
import { selectMuxifiedState } from '../selectors/selector';

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
/*#>*/