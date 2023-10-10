import { map, Subject } from 'rxjs';
import { Method, MethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { axiumConcludeType } from './conclude.quality';
import { selectPayload } from '../../../model/selector';

export const axiumAppendActionListToDialogType: ActionType = 'append Action List to Axium\'s Dialog';

export type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyTopic: string;
}

// const createAppendActionListToDialogMethodCreator: MethodCreator = (concepts$: UnifiedSubject) => {
const createAppendActionListToDialogMethodCreator: MethodCreator = () => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe(
    // withLatestFrom(subConcepts$),
    // map(([action, concepts]) => {
    map(() => {
      // const axiumState = concepts[0].state as AxiumState;
      // if (axiumState.logging) {
      //   const payload = action.payload as AppendActionListToDialogPayload;
      //   let newDialog = payload.strategyKey + '. ';
      //   payload.actionList.forEach(str => {newDialog += str + ' ';});
      //   console.log(newDialog);
      // }
      return createAction(axiumConcludeType);
    })
  );
  return [
    logMethod,
    logSubject
  ];
};

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
