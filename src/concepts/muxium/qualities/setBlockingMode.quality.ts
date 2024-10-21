/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will set the Muxium's mode to blocking. While in this mode
the Muxium operates in a synchronous behavior to quickly modify the Muxium's conceptual set.
$>*/
/*<#*/
import { Subscriber } from 'rxjs';
import { forEachConcept, LoadConcepts } from '../../../model/concept';
import { Action } from '../../../model/action/action.type';
import { MuxiumState } from '../muxium.concept';
import { blockingMethodSubscription } from '../../../model/muxium';
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { MuxiumSetBlockingModePayload } from '.';

export const muxiumSetBlockingMode = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumSetBlockingModePayload>({
  type: 'set Muxium to Blocking Mode',
  reducer: (state, _action) => {
    let methodSubscribers = state.methodSubscribers;
    methodSubscribers.forEach(named => named.subscription.unsubscribe());
    methodSubscribers = [];

    const payload = _action.payload;
    const concepts = payload.concepts;
    forEachConcept(concepts, (concept => {
      concept.qualities.forEach(quality => {
        if (quality.method) {
          const sub = quality.method.subscribe(([action, _]) => {
            const tail = state.tail;
            blockingMethodSubscription(concepts, tail, action);
          });
          methodSubscribers.push({
            name: concept.name,
            subscription: sub as Subscriber<Action>
          });
        }
      });
    }));

    return {
      modeIndex: 0,
      methodSubscribers,
      open: false,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/