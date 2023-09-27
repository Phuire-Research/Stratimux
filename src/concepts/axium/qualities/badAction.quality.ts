import { Action, ActionType } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { AxiumState } from '../axium.concept';

export const axiumBadActionType: ActionType = 'Axium received a Bad Action';

export function badActionReducer(state: AxiumState, action: Action) {
  if (state.logging) {
    console.log('Axium Received a Bad Action: ', action);
  }
  return {
    ...state,
  };
}

export const badActionQuality = createQuality(
  axiumBadActionType,
  badActionReducer
);