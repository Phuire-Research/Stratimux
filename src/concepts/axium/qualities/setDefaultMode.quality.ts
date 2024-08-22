/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will set the Axium to its default mode.
This mode likewise can be specified by changing the defaultModeIndex state property.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { forEachConcept, LoadConcepts } from '../../../model/concept';
import { Action } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { defaultMethodSubscription, getAxiumState } from '../../../model/axium';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { AxiumSetDefaultModePayload } from '.';

export const axiumSetDefaultMode = createQualityCardWithPayload<AxiumState<unknown, LoadConcepts>, AxiumSetDefaultModePayload>({
  type: 'set Axium to its current Default Mode Index',
  reducer: (state, _action) => {
    let methodSubscribers = state.methodSubscribers;
    methodSubscribers.forEach(named => named.subscription.unsubscribe());
    methodSubscribers = [];
    const payload = _action.payload;
    const concepts = payload.concepts;
    forEachConcept(concepts, (concept => {
      concept.qualities.forEach(quality => {
        if (quality.method) {
          const sub = quality.method.subscribe(([action, async]) => {
            const tail = state.tail;
            defaultMethodSubscription(payload.concepts, tail, getAxiumState(concepts).action$, action, async);
          });
          methodSubscribers.push({
            name: concept.name,
            subscription: sub as Subscriber<Action>
          });
        }
      });
    }));

    return {
      modeIndex: state.defaultModeIndex,
      methodSubscribers,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/