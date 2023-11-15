import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type OpenPayload = {
  open: boolean
};

export const axiumOpenType: ActionType = 'Open Axium';
export const axiumOpen = prepareActionWithPayloadCreator<OpenPayload>(axiumOpenType);

export function openReducer(state: AxiumState, action: Action): AxiumState {
  const open = selectPayload<OpenPayload>(action).open;
  return {
    ...state,
    open,
  };
}
export const axiumOpenQuality = createQuality(
  axiumOpenType,
  openReducer,
  defaultMethodCreator
);
