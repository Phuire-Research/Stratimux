import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type OpenPayload = boolean;

export const axiumOpenType: ActionType = 'Open Axium';
export const axiumOpen = prepareActionWithPayloadCreator<OpenPayload>(axiumOpenType);

export function openReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<OpenPayload>(action);
  return {
    ...state,
    open: payload,
  };
}
export const openQuality = createQuality(
  axiumOpenType,
  openReducer,
  defaultMethodCreator
);
