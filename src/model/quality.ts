/*<$
For the asynchronous graph programming framework Stratimux, define the Quality model file.
This model allows for qualities to be made at a single point of entry, reducing the complexity of defining such.
$>*/

import { Subject, map } from 'rxjs';
import { Action, ActionCreator, ActionCreatorWithPayload, prepareActionCreator, prepareActionWithPayloadCreator } from './action';
import { strategySuccess } from './actionStrategy';
import { Method, MethodCreator, Quality, Reducer } from './concept';
import { ActionType } from './method';
import { KeyedSelector } from './selector';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';

/*<#*/

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

export type QualityState = {
  semaphore: [number, number, number, number];
}

function createQuality(
  actionType: ActionType,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>,
): Quality {
  const _qualityState: QualityState = {
    semaphore: [-1, -1, -1, -1],
  };
  return {
    actionType,
    reducer,
    methodCreator,
    keyedSelectors,
    meta,
    analytics
  };
}

export function createQualitySet(q: {
  type: string,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): [ActionCreator, ActionType, Quality] {
  return [
    prepareActionCreator(q.type),
    q.type,
    createQuality(q.type, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
  ];
}

export function createQualitySetWithPayload<T extends Record<string, unknown>>(q: {
  type: string,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>
}): [ActionCreatorWithPayload<T>, ActionType, Quality] {
  return [
    prepareActionWithPayloadCreator<T>(q.type),
    q.type,
    createQuality(q.type, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
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