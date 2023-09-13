import { Subject, Subscriber } from 'rxjs';
import { Concept, createDefaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { defaultMethodSubscription } from '../../../model/axium';

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
          const action$ = state.action$ as Subject<Action>;
          defaultMethodSubscription(action$, action);
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
    modeIndex: [state.defaultModeIndex],
    methodSubscribers,
  };
}

export const setDefaultModeQuality = createQuality(
  axiumSetDefaultModeType,
  setDefaultModeReducer,
  createDefaultMethodCreator
);
