import { defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { Counter } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';

export const counterSetCountType = 'Counter Chain Count';

export const counterSetCount = prepareActionCreator(counterSetCountType);
export type SetCountPayload = {
  newCount: number
}

export function setCountReducer(state: Counter, action: Action) {
  const payload = action.payload as SetCountPayload;
  return {
    ...state,
    count: payload.newCount
  };
}

export const setCountQuality = createQuality(
  counterSetCountType,
  setCountReducer,
  defaultMethodCreator,
  [counterSelectCount]
);
