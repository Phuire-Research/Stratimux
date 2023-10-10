import { Action, ActionType } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';
import { AxiumState } from '../axium.concept';

export const axiumBadActionType: ActionType = 'Axium received a Bad Action';
export type BadActionPayload = Action[];

export function badActionReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<BadActionPayload>(action);
  if (state.logging) {
    console.log('Axium Received a Bad Action: ', action);
  }
  return {
    ...state,
    badActions: [
      ...state.badActions, ...payload
    ]
  };
}

export const badActionQuality = createQuality(
  axiumBadActionType,
  badActionReducer
);