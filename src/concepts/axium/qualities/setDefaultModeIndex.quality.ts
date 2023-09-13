import { Quality, Reducer, createDefaultMethodCreator, createQuality, defaultReducer } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumSetDefaultModeIndexType: ActionType = 'Axium set default Mode Index';

export type SetDefaultModeIndex = {
  index: number;
};

export function setDefaultModeIndexReducer(state: AxiumState, action: Action) {
  const payload = action.payload as SetDefaultModeIndex;
  return {
    ...state,
    defaultModeIndex: payload.index,
  } as AxiumState;
}
export const setDefaultModeIndexQuality = createQuality(
  axiumSetDefaultModeIndexType,
  setDefaultModeIndexReducer,
  createDefaultMethodCreator
);
