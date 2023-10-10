import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export const axiumOpenType: ActionType = 'Open Axium';
export const axiumOpen = prepareActionCreator(axiumOpenType);

export type OpenPayload = {
  open?: boolean;
} | undefined;

export function openReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<OpenPayload>(action);
  return {
    ...state,
    open: payload?.open ? payload.open : true
  };
}
export const openQuality = createQuality(
  axiumOpenType,
  openReducer,
  defaultMethodCreator
);
