/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will set the Axium's mode to blocking. While in this mode
the Axium operates in a synchronous behavior to quickly modify the Axium's conceptual set.
$>*/
/*<#*/
import { Subject, Subscriber } from 'rxjs';
import { Concepts, defaultMethodCreator, forEachConcept } from '../../../model/concept';
import { Action } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { blockingMethodSubscription } from '../../../model/axium';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumSetBlockingModePayload = {
    concepts: Concepts
}

export const [
  axiumSetBlockingMode,
  axiumSetBlockingModeType,
  axiumSetBlockingModeQuality
] = createQualitySetWithPayload<AxiumSetBlockingModePayload>({
  type: 'set Axium to Blocking Mode',
  reducer: (state: AxiumState, _action) => {
    let methodSubscribers = state.methodSubscribers;
    methodSubscribers.forEach(named => named.subscription.unsubscribe());
    methodSubscribers = [];

    const payload = selectPayload<AxiumSetBlockingModePayload>(_action);
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
  },
  methodCreator: defaultMethodCreator
});
/*#>*/