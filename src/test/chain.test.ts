import { createAxium } from '../model/axium';
import { Concept  } from '../model/concept';
import { createAction, primeAction } from '../model/action';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, counterKey } from '../concepts/counter/counter.concept';
import { createChainConcept } from '../concepts/chain/chain.concept';
import { PrepareChainPayload, chainPrepareChainType } from '../concepts/chain/qualities/prepareChain.quality';
import { counterAddType } from '../concepts/counter/qualities/add.quality';
import { counterSubtractType } from '../concepts/counter/qualities/subtract.quality';

test('Axium Test', (done) => {
  const axium = createAxium([createCounterConcept(), createChainConcept()], true, true);
  // ax.subscribe(val=> console.log(val));
  // ax.subscribe(val => console.log('this value', val));
  let count = 0;
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    if (count === 1) {
      const primedPrepareChain = primeAction(concepts, createAction(chainPrepareChainType));
      const primedAdd = primeAction(concepts, createAction(counterAddType));
      const primedSubtract = primeAction(concepts, createAction(counterSubtractType));
      primedPrepareChain.payload = {
        actions: [
          primedAdd,
          primedAdd,
          primedSubtract,
          primedAdd,
          primedSubtract,
          primedAdd,
        ]} as PrepareChainPayload;
      axium.dispatch(primedPrepareChain);
    }
    else if (count === 7) {
      const counter = selectState<Counter>(concepts, counterKey);
      expect(counter.count).toBe(2);
      setTimeout(() => {done();}, 500);
      sub.unsubscribe();
    }
  });
});
