import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { endOfActionStrategyType, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { axiumBadActionType } from './badAction.quality';
import { createQuality } from '../../../model/concept';
import { axiumAppendActionListToDialogType, AppendActionListToDialogPayload } from './appendActionListToDialog.quality';

export const axiumSetDefaultModeType: ActionType = 'Axium Set Default Mode';

export type SetDefaultModePayload = {
    concepts: Concept[]
}

export function setDefaultModeReducer(state: AxiumState, _action: Action) {
  let methodSubscribers = state.methodSubscribers;
  methodSubscribers.forEach(keyed => keyed.subscriber.unsubscribe());
  methodSubscribers = [];
  const payload = _action.payload as SetDefaultModePayload;
  const concepts = payload.concepts;
  concepts.forEach(concept => {
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
            setTimeout(() => {
              state.action$?.next(appendToDialog);
            }, 0);
          } else if (
            action.strategy &&
            action.type !== endOfActionStrategyType &&
            action.type !== axiumBadActionType
          ) {
            setTimeout(() => {
              state.action$?.next(action);
            }, 0);
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
    modeIndex: [1],
    methodSubscribers,
  };
}

export const setDefaultModeQuality = createQuality(
  axiumSetDefaultModeType,
  setDefaultModeReducer,
  createDefaultMethodCreator
);
