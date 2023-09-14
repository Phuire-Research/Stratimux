import { Quality, Reducer, createDefaultMethodCreator, createQuality, defaultReducer } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
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
  createDefaultMethodCreator,
);
