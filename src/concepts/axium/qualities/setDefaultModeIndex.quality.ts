import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type SetDefaultModeIndexPayload = {
  index: number;
};
export const axiumSetDefaultModeIndexType: ActionType = 'set Axium\'s Default Mode Index';
export const axiumSetDefaultModeIndex = prepareActionWithPayloadCreator<SetDefaultModeIndexPayload>(axiumSetDefaultModeIndexType);

export function setDefaultModeIndexReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<SetDefaultModeIndexPayload>(action);
  return {
    ...state,
    defaultModeIndex: payload.index,
  } as AxiumState;
}
export const axiumSetDefaultModeIndexQuality = createQuality(
  axiumSetDefaultModeIndexType,
  setDefaultModeIndexReducer,
  defaultMethodCreator
);
