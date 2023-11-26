import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyTopic: string;
  strategyData: unknown;
}
export const axiumAppendActionListToDialogType: ActionType = 'append Action List to Axium\'s Dialog';
export const axiumAppendActionListToDialog =
  prepareActionWithPayloadCreator<AppendActionListToDialogPayload>(axiumAppendActionListToDialogType);

export function axiumAppendActionListToDialogReducer(state: AxiumState, action: Action): AxiumState {
  const payload = selectPayload<AppendActionListToDialogPayload>(action);
  let newDialog = '';
  if (state.storeDialog) {
    payload.actionList.forEach(str => {newDialog += str + ' ';});
    if (state.logging) {
      console.log(newDialog);
    }
    return {
      ...state,
      dialog: state.dialog + newDialog,
      lastStrategy: payload.strategyTopic,
      lastStrategyData: payload.strategyData,
      lastStrategyDialog: newDialog
    };
  }
  return {
    ...state,
    lastStrategy: payload.strategyTopic,
    lastStrategyData: payload.strategyData,
  };
}

export const axiumAppendActionListToDialogQuality = createQuality(
  axiumAppendActionListToDialogType,
  axiumAppendActionListToDialogReducer,
);
