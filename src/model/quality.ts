/*<$
For the asynchronous graph programming framework Stratimux, define the Quality model file.
This model allows for qualities to be made at a single point of entry, reducing the complexity of defining such.
$>*/

import { Subject, map } from 'rxjs';
import { Action, ActionCreator, ActionCreatorType, ActionCreatorWithPayload, prepareActionCreator, prepareActionWithPayloadCreator } from './action';
import { strategySuccess } from './actionStrategy';
import { Method, MethodCreator, Reducer, createQuality } from './concept';
import { ActionType } from './method';
import { KeyedSelector } from './selector';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';

/*<#*/
export type Quality<T = void> = {
  actionType: ActionType;
  actionSemaphoreBucket: [number, number, number, number][];
  actionCreator: T extends Record<string, unknown> ? ActionCreatorWithPayload<T> : ActionCreator;
  reducer: Reducer;
  toString: () => string;
  methodCreator?: MethodCreator;
  method?: Method;
  subject?: Subject<Action>;
  keyedSelectors?: KeyedSelector[];
  meta?: Record<string,unknown>;
  analytics?: Record<string,unknown>;
};

export type Qualities = {
  [s: string]: Quality<Record<string, unknown>> | Quality<undefined>
  // [s: string]: Quality<Record<string, unknown>>
};

export function defaultReducer(state: unknown, _: Action) {
  return state;
}
defaultReducer.toString = () => ('Default Reducer');

export function nullReducer(_: unknown, __: Action) {
  return null;
}
nullReducer.toString = () => ('Null Reducer');

export const defaultMethodCreator: MethodCreator = () : [Method, Subject<Action>] =>  {
  const defaultSubject = new Subject<Action>();
  const defaultMethod: Method = defaultSubject.pipe(
    map((action: Action) => {
      if (action.strategy) {
        return [strategySuccess(action.strategy), false];
      }
      return [{
        ...action,
        type: axiumConcludeType
      }, false];
    }),
  );

  defaultMethod.toString = () => ('Default Method');
  return [defaultMethod, defaultSubject];
};

export function createQualitySet(q: {
  type: string,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): [ActionCreator, ActionType, Quality<void>] {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const actionCreator = prepareActionCreator(q.type, bucket);
  return [
    actionCreator,
    q.type,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createQuality<void>(q.type, bucket, actionCreator, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
  ];
}

export function createQualitySetWithPayload<T extends Record<string, unknown>>(q: {
  type: string,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): [ActionCreatorWithPayload<T>, ActionType, Quality<T>] {
  const bucket: [number, number, number, number][] = [[-1, -1, -1, -1]];
  const actionCreatorWithPayload = prepareActionWithPayloadCreator<T>(q.type, bucket) as ActionCreatorType<T>;
  return [
    actionCreatorWithPayload,
    q.type,
    createQuality<T>(q.type, bucket, actionCreatorWithPayload, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
  ];
}

export const quality = {
  defaultReducer,
  nullReducer,
  defaultMethodCreator,
  create: createQuality,
  createSet: createQualitySet,
  createSetWithPayload: createQualitySetWithPayload
};
/*#>*/