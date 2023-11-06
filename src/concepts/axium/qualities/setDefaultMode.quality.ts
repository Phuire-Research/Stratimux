import { Subject, Subscriber } from 'rxjs';
import { Concepts, defaultMethodCreator, forEachConcept } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { defaultMethodSubscription } from '../../../model/axium';
import { selectPayload } from '../../../model/selector';

export type SetDefaultModePayload = {
    concepts: Concepts
}
export const axiumSetDefaultModeType: ActionType = 'set Axium to its current Default Mode Index';
export const axiumSetDefaultMode = prepareActionWithPayloadCreator<SetDefaultModePayload>(axiumSetDefaultModeType);

export function setDefaultModeReducer(state: AxiumState, _action: Action): AxiumState {
  let methodSubscribers = state.methodSubscribers;
  methodSubscribers.forEach(named => named.subscription.unsubscribe());
  methodSubscribers = [];
  const payload = selectPayload<SetDefaultModePayload>(_action);
  const concepts = payload.concepts;
  forEachConcept(concepts, (concept => {
    concept.qualities.forEach(quality => {
      if (quality.method) {
        const sub = quality.method.subscribe(action => {
          const action$ = state.action$ as Subject<Action>;
          defaultMethodSubscription(action$, action);
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
    modeIndex: state.defaultModeIndex,
    methodSubscribers,
  };
}

export const axiumSetDefaultModeQuality = createQuality(
  axiumSetDefaultModeType,
  setDefaultModeReducer,
  defaultMethodCreator
);
