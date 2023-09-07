import { AxiumState } from '../axium.concept';
import { Action, createAction} from '../../../model/action';
import { createQuality, createDefaultMethodCreator } from '../../../model/concept';

export const axiumSetModeType = 'Axium Set Mode';

export type SetModePayload = {
  modeIndex: number;
}

export function setModeReducer(state: AxiumState, _action: Action) {
  const payload = _action.payload as SetModePayload;
  return {
    ...state,
    modeIndex: [payload.modeIndex],
  };
}

export const setModeQuality = createQuality(
  axiumSetModeType,
  setModeReducer,
  createDefaultMethodCreator
);
