import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { primeAction } from '../model/action';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import { createChainConcept } from '../concepts/chain/chain.concept';
import { ChainDispatchActionsPayload, chainDispatchActions } from '../concepts/chain/qualities/prepareChain.quality';
import { counterAdd } from '../concepts/counter/qualities/add.quality';
import { counterSubtract } from '../concepts/counter/qualities/subtract.quality';

test('Axium Test', (done) => {
  const axium = createAxium('chainConceptTest', [createCounterConcept(), createChainConcept()], true, true);
  let count = 0;
  let willDispatch = true;
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    if (willDispatch) {
      willDispatch = false;
      const primedAdd = primeAction(concepts, counterAdd());
      const primedSubtract = primeAction(concepts, counterSubtract());
      const primedPrepareChain =
      primeAction(concepts,
        chainDispatchActions({
          actions: [
            primedAdd,
            primedAdd,
            primedSubtract,
            primedAdd,
            primedSubtract,
            primedAdd,
          ]
        }));
      axium.dispatch(primedPrepareChain);
    }
    else if (count === 7) {
      const counter = selectState<Counter>(concepts, counterName);
      expect(counter.count).toBe(2);
      setTimeout(() => {done();}, 500);
      sub.unsubscribe();
    }
  });
});
