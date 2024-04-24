/*<$
For the asynchronous graph programming framework Stratimux, define the Quality model file.
This model allows for qualities to be made at a single point of entry, reducing the complexity of defining such.
$>*/

import { ActionCreator, ActionCreatorWithPayload, prepareActionCreator, prepareActionWithPayloadCreator } from './action';
import { MethodCreator, Quality, Reducer, createQuality } from './concept';
import { ActionType } from './method';
import { KeyedSelector } from './selector';

/*<#*/
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
/*#>*/