import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action } from '../../../model/action';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { badAction } from './badAction.quality';
import { createQuality } from '../../../model/concept';
import { appendActionListToDialog, AppendActionListToDialogPayload } from './appendActionListToDialog.quality';

export const setBlockingMode: Action = createAction('Axium Set Blocking Mode');

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
            action.type === endOfActionStrategy.type
          ) {
            // Allows for reducer next in sequence
            const appendToDialog = {...appendActionListToDialog};
            appendToDialog.payload = {
              actionList: action.strategy.actionList,
              strategyKey: action.strategy.key
            } as AppendActionListToDialogPayload;
            state.action$?.next(appendToDialog);
          } else if (
            action.strategy &&
            action.type !== endOfActionStrategy.type &&
            action.type !== badAction.type
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
  setBlockingMode,
  setBlockingModeReducer,
  createDefaultMethodCreator
);
