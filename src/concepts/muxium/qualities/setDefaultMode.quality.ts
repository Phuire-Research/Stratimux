/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality that will set the Muxium to its default mode.
This mode likewise can be specified by changing the defaultModeIndex state property.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { forEachConcept, LoadConcepts } from '../../../model/concept';
import { Action } from '../../../model/action';
import { MuxiumState } from '../muxium.concept';
import { defaultMethodSubscription, getMuxiumState } from '../../../model/muxium';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { MuxiumSetDefaultModePayload } from '.';

export const muxiumSetDefaultMode = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumSetDefaultModePayload>({
  type: 'set Muxium to its current Default Mode Index',
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
            defaultMethodSubscription(payload.concepts, tail, getMuxiumState(concepts).action$, action, async);
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