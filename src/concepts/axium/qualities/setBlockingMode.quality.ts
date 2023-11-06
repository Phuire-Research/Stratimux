import { Subject, Subscriber } from 'rxjs';
import { Concepts, defaultMethodCreator, forEachConcept } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { blockingMethodSubscription } from '../../../model/axium';
import { selectPayload } from '../../../model/selector';

export type SetBlockingModePayload = {
    concepts: Concepts
}
export const axiumSetBlockingModeType: ActionType = 'set Axium to Blocking Mode';
export const axiumSetBlockingMode = prepareActionWithPayloadCreator<SetBlockingModePayload>(axiumSetBlockingModeType);

export function setBlockingModeReducer(state: AxiumState, _action: Action): AxiumState {
  let methodSubscribers = state.methodSubscribers;
  methodSubscribers.forEach(named => named.subscription.unsubscribe());
  methodSubscribers = [];

  const payload = selectPayload<SetBlockingModePayload>(_action);
  const concepts = payload.concepts;
  forEachConcept(concepts, (concept => {
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
  }));

  return {
    ...state,
    modeIndex: 0,
    methodSubscribers,
    open: false,
  };
}

export const axiumSetBlockingModeQuality = createQuality(
  axiumSetBlockingModeType,
  setBlockingModeReducer,
  defaultMethodCreator
);
