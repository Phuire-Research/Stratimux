/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will set the Axium to its default mode.
This mode likewise can be specified by changing the defaultModeIndex state property.
$>*/
/*<#*/
import { Subject, Subscriber } from 'rxjs';
import { Concepts, defaultMethodCreator, forEachConcept } from '../../../model/concept';
import { Action } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { defaultMethodSubscription, getAxiumState } from '../../../model/axium';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumSetDefaultModePayload = {
    concepts: Concepts
}

export const [
  axiumSetDefaultMode,
  axiumSetDefaultModeType,
  axiumSetDefaultModeQuality
] = createQualitySetWithPayload<AxiumSetDefaultModePayload>({
  type: 'set Axium to its current Default Mode Index',
  reducer: (state: AxiumState, _action) => {
    let methodSubscribers = state.methodSubscribers;
    methodSubscribers.forEach(named => named.subscription.unsubscribe());
    methodSubscribers = [];
    const payload = selectPayload<AxiumSetDefaultModePayload>(_action);
    const concepts = payload.concepts;
    forEachConcept(concepts, (concept => {
      concept.qualities.forEach(quality => {
        if (quality.method) {
          const sub = quality.method.subscribe(([action, async]) => {
            const tail = state.tail;
            defaultMethodSubscription(tail, getAxiumState(concepts).action$, action, async);
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
  },
  methodCreator: defaultMethodCreator
});
/*#>*/