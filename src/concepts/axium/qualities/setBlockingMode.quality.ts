import { Observable, Subject, Subscriber, catchError } from 'rxjs';
import { Concept, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { blockingMethodSubscription } from '../../../model/axium';
import { selectPayload } from '../../../model/selector';

export type SetBlockingModePayload = {
    concepts: Concept[]
}
export const axiumSetBlockingModeType: ActionType = 'set Axium to Blocking Mode';
export const axiumSetBlockingMode = prepareActionWithPayloadCreator<SetBlockingModePayload>(axiumSetBlockingModeType);

export function setBlockingModeReducer(state: AxiumState, _action: Action) {
  let methodSubscribers = state.methodSubscribers;
  methodSubscribers.forEach(named => named.subscription.unsubscribe());
  methodSubscribers = [];

  const payload = selectPayload<SetBlockingModePayload>(_action);
  const concepts = payload.concepts;
  concepts.forEach(concept => {
    concept.qualities.forEach(quality => {
      if (quality.method) {
        const sub = quality.method.subscribe(action => {
          const action$ = state.action$ as Subject<Action>;
          blockingMethodSubscription(action$, action);
        });
        methodSubscribers.push({
          name: concept.name,
          subscription: sub as Subscriber<Action>
        });
      }
    });
  });

  return {
    ...state,
    modeIndex: [0],
    methodSubscribers,
    open: false,
  };
}

export const setBlockingModeQuality = createQuality(
  axiumSetBlockingModeType,
  setBlockingModeReducer,
  defaultMethodCreator
);
