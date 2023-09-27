import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumClearDialogType: ActionType = 'clear Axium Dialog';

export function clearDialogReducer(state: AxiumState, action: Action) {
  const payload = action.payload;
  return {
    ...state,
    dialog: '',
  };
}

export const clearDialogQuality = createQuality(
  axiumClearDialogType,
  clearDialogReducer,
  defaultMethodCreator,
);
