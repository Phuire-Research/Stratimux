/*<$
For the framework Stratimux and Axium Concept, generate a quality that will clear the state's dialog.
$>*/
/*<#*/
import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumClearDialogType: ActionType = 'clear Axium Dialog';
export const axiumClearDialog = prepareActionCreator(axiumClearDialogType);

export function axiumClearDialogReducer(state: AxiumState, action: Action) {
  return {
    ...state,
    dialog: '',
  };
}

export const axiumClearDialogQuality = createQuality(
  axiumClearDialogType,
  axiumClearDialogReducer,
  defaultMethodCreator,
);
/*#>*/