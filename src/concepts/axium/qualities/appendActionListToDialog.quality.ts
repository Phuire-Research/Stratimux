import { BehaviorSubject, map, Subject, switchMap, withLatestFrom } from 'rxjs';
import { Concept, Method, MethodCreator, Quality, Reducer, defaultReducer } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { AxiumState } from '../axium.concept';
import { axiumConcludeType } from './conclude.quality';

export const axiumAppendActionListToDialogType: ActionType = 'Axium Append Action List to Dialog';

export type AppendActionListToDialogPayload = {
  actionList: Array<string>;
  strategyKey: string;
}

const createAppendActionListToDialogMethodCreator: MethodCreator = (subConcepts$: Subject<Concept[]>) => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe(
    withLatestFrom(subConcepts$),
    map(([action, concepts]) => {
      const axiumState = concepts[0].state as AxiumState;
      if (axiumState.logging) {
        const payload = action.payload as AppendActionListToDialogPayload;
        let newDialog = payload.strategyKey + '. ';
        payload.actionList.forEach(str => {newDialog += str + ' ';});
        console.log(newDialog);
      }
      return createAction(axiumConcludeType);
    })
  );
  return [
    logMethod,
    logSubject
  ];
};

export function appendActionListToDialogReducer(state: AxiumState, action: Action) {
  const payload = action.payload as AppendActionListToDialogPayload;
  let newDialog = '';
  if (state.dialog !== '') {
    newDialog = state.dialog + '\n';
  }
  newDialog += payload.strategyKey + '. ';
  payload.actionList.forEach(str => {newDialog += str + ' ';});
  return {
    ...state,
    dialog: newDialog,
    lastStrategy: payload.strategyKey,
  };
}

export const appendActionListToDialogQuality = createQuality(
  axiumAppendActionListToDialogType,
  appendActionListToDialogReducer,
  createAppendActionListToDialogMethodCreator,
);
