import { Quality, Reducer, createQuality, defaultReducer } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumOpenType: ActionType = 'Axium open';

export function openReducer(state: AxiumState, action: Action) {
  return {
    ...state,
    open: true
  };
}
export const openQuality = createQuality(
  axiumOpenType,
  openReducer
);
