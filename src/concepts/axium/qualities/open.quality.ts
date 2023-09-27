import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumOpenType: ActionType = 'Open Axium';

export type OpenPayload = {
  open?: boolean;
} | undefined;
export function openReducer(state: AxiumState, action: Action) {
  const payload = action.payload as OpenPayload;
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
