import { map, Subject } from 'rxjs';
import { Method, MethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyTopic: string;
}
export const axiumAppendActionListToDialogType: ActionType = 'append Action List to Axium\'s Dialog';
export const axiumAppendActionListToDialog =
  prepareActionWithPayloadCreator<AppendActionListToDialogPayload>(axiumAppendActionListToDialogType);

export function appendActionListToDialogReducer(state: AxiumState, action: Action) {
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
    };
  }
  return {
    ...state,
    lastStrategy: payload.strategyTopic
  };
}

export const appendActionListToDialogQuality = createQuality(
  axiumAppendActionListToDialogType,
  appendActionListToDialogReducer,
);
