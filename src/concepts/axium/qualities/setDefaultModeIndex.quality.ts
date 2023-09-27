import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumSetDefaultModeIndexType: ActionType = 'set Axium\'s Default Mode Index';

export type SetDefaultModeIndexPayload = {
  index: number;
};

export function setDefaultModeIndexReducer(state: AxiumState, action: Action) {
  const payload = action.payload as SetDefaultModeIndexPayload;
  return {
    ...state,
    defaultModeIndex: payload.index,
  } as AxiumState;
}
export const setDefaultModeIndexQuality = createQuality(
  axiumSetDefaultModeIndexType,
  setDefaultModeIndexReducer,
  defaultMethodCreator
);
