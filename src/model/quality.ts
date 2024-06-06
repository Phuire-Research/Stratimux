/*<$
For the asynchronous graph programming framework Stratimux, define the Quality model file.
This model allows for qualities to be made at a single point of entry, reducing the complexity of defining such.
$>*/

import { Subject, map } from 'rxjs';
import { Action, ActionCreator, ActionCreatorType, ActionCreatorWithPayload, prepareActionCreator, prepareActionWithPayloadCreator } from './action';
import { strategySuccess } from './actionStrategy';
import { Concepts, Method, MethodCreator, MethodCreatorStep, Reducer, createQuality } from './concept';
import { ActionType } from './method';
import { KeyedSelector } from './selector';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';

/*<#*/
export type Quality<S extends Record<string, unknown>, T = void> = {
  actionType: ActionType;
  actionSemaphoreBucket: [number, number, number, number][];
  actionCreator: T extends Record<string, unknown> ? ActionCreatorWithPayload<T> : ActionCreator;
  reducer: Reducer<any, T>;
  toString: () => string;
  methodCreator?: MethodCreatorStep<S, T>;
  method?: Method<unknown>;
  subject?: Subject<Action<any>>;
  keyedSelectors?: KeyedSelector[];
  meta?: Record<string,unknown>;
  analytics?: Record<string,unknown>;
};

export type Qualities = {
  [s: string]: Quality<Record<string, unknown>, Record<string, unknown>> | Quality<Record<string, unknown>, undefined>;
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

export const defaultMethodCreator = <T = void>() =>
  (_concepts$: Subject<Concepts>, _semaphore: number) : [Method<T>, Subject<Action<T>>] =>  {
    const defaultSubject = new Subject<Action<T>>();
    const defaultMethod = defaultSubject.pipe(
      map((action: Action<T>) => {
        if (action.strategy) {
          return [strategySuccess(action.strategy), false];
        }
        return [{
          ...action,
          type: axiumConcludeType
        }, false];
      }),
    ) as Method<T>;

    defaultMethod.toString = () => ('Default Method');
    return [defaultMethod, defaultSubject];
  };

export function createQualityCard<S extends Record<string, unknown>>(q: {
  type: string,
  reducer: Reducer<S, void>,
  methodCreator?: MethodCreatorStep<S, void>,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): [ActionCreator, ActionType, Quality<S, void>] {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const actionCreator = prepareActionCreator(q.type, bucket);
  if (q.methodCreator) {
    return [
      actionCreator,
      q.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createQuality<S, void>(q.type, bucket, actionCreator, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
    ];
  }
  return [
    actionCreator,
    q.type,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createQuality<S, void>(q.type, bucket, actionCreator, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
  ];
}

export function createQualityCardWithPayload<
  S extends Record<string, unknown>,
  T extends Record<string, unknown>
>(q: {
  type: string,
  reducer: Reducer<S, T>,
  methodCreator?: MethodCreatorStep<S, T>,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): Quality<S, T> {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const actionCreatorWithPayload = prepareActionWithPayloadCreator<T>(q.type, bucket);
  if (q.methodCreator) {
    return createQuality<S, T>(
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
  return createQuality<S, T>(
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
  create: createQuality,
  createSet: createQualityCard,
  createSetWithPayload: createQualityCardWithPayload
};
/*#>*/