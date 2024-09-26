/*<$
For the asynchronous graph programming framework Stratimux, define the Quality model file.
This model allows for qualities to be made at a single point of entry, reducing the complexity of defining such.
$>*/

/*<#*/

import { Subject, map } from 'rxjs';
import {
  Action,
  ActionCreator,
  ActionCreatorType,
  ActionCreatorWithPayload,
  prepareActionCreator,
  prepareActionWithPayloadCreator
} from './action';
import { strategySuccess } from './actionStrategy';
import { ActionDeck, Concepts, Method, MethodCreatorStep, SpecificReducer, createQuality } from './concept';
import { ActionType } from './action';
import { KeyedSelector } from './selector';
import { muxiumConcludeType } from '../concepts/muxium/qualities/conclude.quality';

export type Quality<S extends Record<string, unknown>, T = void, C = void> = {
  actionType: ActionType;
  actionSemaphoreBucket: [number, number, number, number][];
  actionCreator: T extends Record<string, unknown> ? ActionCreatorWithPayload<T> : ActionCreator;
  reducer: SpecificReducer<any, T, C>;
  toString: () => string;
  methodCreator?: MethodCreatorStep<S, T, C>;
  method?: Method<unknown>;
  subject?: Subject<ActionDeck<T, C>>;
  keyedSelectors?: KeyedSelector[];
  meta?: Record<string,unknown>;
  analytics?: Record<string,unknown>;
};

export type Qualities = {
  [s: string | symbol]: Quality<Record<string, unknown>, Record<string, unknown>> | Quality<Record<string, unknown>, undefined>;
  // [s: string]: Quality<Record<string, unknown>>
};

export function defaultReducer<S extends Record<string, unknown>>(state: S, _: Action<any>): S {
  return state;
}
defaultReducer.toString = () => ('Default Reducer');

export function nullReducer<S extends Record<string, unknown>>(_: S, __: Action<any>) {
  return null;
}
nullReducer.toString = () => ('Null Reducer');

export const defaultMethodCreator = <T = void, C = void>() =>
  (_concepts$: Subject<Concepts>, _semaphore: number) : [Method<T>, Subject<ActionDeck<T, C>>] =>  {
    const defaultSubject = new Subject<ActionDeck<T, C>>();
    const defaultMethod = defaultSubject.pipe(
      map((act: ActionDeck<T, C>) => {
        if (act.action.strategy) {
          return [strategySuccess(act.action.strategy), false];
        }
        return [{
          ...act.action,
          type: muxiumConcludeType
        }, false];
      }),
    ) as Method<T>;

    defaultMethod.toString = () => ('Default Method');
    return [defaultMethod, defaultSubject];
  };

export function createQualityCard<S extends Record<string, unknown>, C = void>(q: {
  type: string,
  reducer: SpecificReducer<S, void, C>,
  methodCreator?: MethodCreatorStep<S, void, C>,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): Quality<S, void, C> {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const actionCreator = prepareActionCreator(q.type, bucket);
  if (q.methodCreator) {
    return createQuality<S, void, C>(q.type, bucket, actionCreator, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics);
  }
  return createQuality<S, void, C>(q.type, bucket, actionCreator, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics);
}

export function createQualityCardWithPayload<
  S extends Record<string, unknown>,
  T extends Record<string, unknown>,
  C = void
>(q: {
  type: string,
  reducer: SpecificReducer<S, T, C>,
  methodCreator?: MethodCreatorStep<S, T, C>,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): Quality<S, T, C> {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const actionCreatorWithPayload = prepareActionWithPayloadCreator<T>(q.type, bucket);
  if (q.methodCreator) {
    return createQuality<S, T, C>(
      q.type,
      bucket,
      actionCreatorWithPayload as ActionCreatorType<T>,
      q.reducer,
      q.methodCreator,
      q.keyedSelectors,
      q.meta,
      q.analytics
    );
  }
  return createQuality<S, T, C>(
    q.type,
    bucket,
    actionCreatorWithPayload as ActionCreatorType<T>,
    q.reducer,
    q.methodCreator,
    q.keyedSelectors,
    q.meta,
    q.analytics
  );
}

export const quality = {
  defaultReducer,
  nullReducer,
  defaultMethodCreator,
  create: createQualityCard,
  createWithPayload: createQualityCardWithPayload
};
/*#>*/