import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { endOfActionStrategyType, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { axiumBadActionType, } from './badAction.quality';
import { createQuality } from '../../../model/concept';
import { axiumAppendActionListToDialogType, AppendActionListToDialogPayload } from './appendActionListToDialog.quality';

export const axiumSetBlockingModeType: ActionType = 'Axium Set Blocking Mode';

export type SetBlockingModePayload = {
    concepts: Concept[]
}

export function setBlockingModeReducer(state: AxiumState, _action: Action) {
  let methodSubscribers = state.methodSubscribers;
  methodSubscribers.forEach(keyed => keyed.subscriber.unsubscribe());
  methodSubscribers = [];

  const payload = _action.payload as SetBlockingModePayload;
  const concepts = payload.concepts;
  concepts.forEach(concept => {
    console.log('Check Set Blocking Mode: ', concept.key);
    concept.qualities.forEach(quality => {
      if (quality.method) {
        const sub = quality.method.subscribe(action => {
          if (
            action.strategy &&
            action.type === endOfActionStrategyType
          ) {
            // Allows for reducer next in sequence
            const appendToDialog = createAction(axiumAppendActionListToDialogType);
            appendToDialog.payload = {
              actionList: action.strategy.actionList,
              strategyKey: action.strategy.key
            } as AppendActionListToDialogPayload;
            state.action$?.next(appendToDialog);
          } else if (
            action.strategy &&
            action.type !== endOfActionStrategyType &&
            action.type !== axiumBadActionType
          ) {
            state.action$?.next(action);
          }
        });
        methodSubscribers.push({
          key: concept.key,
          subscriber: sub as Subscriber<Action>
        });
      }
    });
  });

  return {
    ...state,
    modeIndex: [0],
    methodSubscribers,
  };
}

export const setBlockingModeQuality = createQuality(
  axiumSetBlockingModeType,
  setBlockingModeReducer,
  createDefaultMethodCreator
);
