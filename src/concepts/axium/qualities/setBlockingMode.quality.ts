import { Subject, Subscriber } from 'rxjs';
import { Concept, createDefaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { blockingMethodSubscription } from '../../../model/axium';

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
    concept.qualities.forEach(quality => {
      if (quality.method) {
        const sub = quality.method.subscribe(action => {
          const action$ = state.action$ as Subject<Action>;
          blockingMethodSubscription(action$, action);
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
