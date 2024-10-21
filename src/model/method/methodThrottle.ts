/*<$
For the asynchronous graph programming framework Stratimux, define the Method Throttle model file.
This file holds the throttle variant helper functions that enable users to quickly create specific provably terminating methods
within their own defined qualities.
$>*/
/*<#*/
import { map, Subject, withLatestFrom } from 'rxjs';
import { Action } from '../action/action.type';
import { ActionDeck, Concepts, MethodCreator } from '../concept';
import {
  Method,
  MethodCreatorBaseThrottle,
  MethodCreatorBaseThrottleWithConcepts,
  MethodCreatorBaseThrottleWithState,
  MethodParams,
  MethodWithConceptsParams,
  MethodWithStateParams
} from './method.type';
import { throttleAction } from '../action/actionOperators';
import { createAction } from '../action/action';
import { selectMuxifiedState } from '../selector';

const muxiumConclude = () => {
  return createAction('Conclude');
};

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

/*#>*/