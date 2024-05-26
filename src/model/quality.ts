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
export type Qualities = Record<string, Quality<Record<string,unknown>>>;

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

function createQuality<T extends Record<string, unknown>>(
  actionType: ActionType,
  actionCreator: ActionCreator | ActionCreatorWithPayload<T>,
  reducer: Reducer,
  methodCreator?: MethodCreator,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyedSelectors?: KeyedSelector[],
  meta?: Record<string,unknown>,
  analytics?: Record<string,unknown>,
): Quality<T> {
  return {
    actionType,
    actionCreator,
    actionSemaphoreBucket: [[-1, -1, -1, -1]],
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
}): [ActionCreator, ActionType, Quality<Record<string, unknown>>] {
  const actionCreator = prepareActionCreator(q.type);
  return [
    actionCreator,
    q.type,
    createQuality(q.type, actionCreator, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
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
  const actionCreatorWithPayload = prepareActionWithPayloadCreator<T>(q.type);
  return [
    actionCreatorWithPayload,
    q.type,
    createQuality(q.type, actionCreatorWithPayload, q.reducer, q.methodCreator, q.keyedSelectors, q.meta, q.analytics)
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