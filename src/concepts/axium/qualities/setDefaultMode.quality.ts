import { BehaviorSubject, map, Subject, Subscriber } from 'rxjs';
import { Concept, Method, Quality, Reducer, createDefaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action } from '../../../model/action';
import { endOfActionStrategy, strategySuccess } from '../../../model/actionStrategy';
import { AxiumState } from '../axium.concept';
import { createAction } from '../../../model/action';
import { badAction } from './badAction.quality';
import { createQuality } from '../../../model/concept';
import { appendActionListToDialog, AppendActionListToDialogPayload } from './appendActionListToDialog.quality';

export const setDefaultMode: Action = createAction('Axium Set Default Mode');

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
            action.type === endOfActionStrategy.type
          ) {
            // Allows for reducer next in sequence
            const appendToDialog = {...appendActionListToDialog};
            appendToDialog.payload = {
              actionList: action.strategy.actionList,
              strategyKey: action.strategy.key
            } as AppendActionListToDialogPayload;
            setTimeout(() => {
              state.action$?.next(appendToDialog);
            }, 0);
          } else if (
            action.strategy &&
            action.type !== endOfActionStrategy.type &&
            action.type !== badAction.type
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
  setDefaultMode,
  setDefaultModeReducer,
  createDefaultMethodCreator
);
