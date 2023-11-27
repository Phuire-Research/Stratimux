/*<$
For the graph programming framework Stratimux and Chain Concept, generate a test ensure that chain is working as intended.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { Concepts } from '../model/concept';
import { primeAction } from '../model/action';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import { createChainConcept } from '../concepts/chain/chain.concept';
import { chainDispatchActions } from '../concepts/chain/qualities/prepareChain.quality';
import { counterAdd } from '../concepts/counter/qualities/add.quality';
import { counterSubtract } from '../concepts/counter/qualities/subtract.quality';

test('Axium Test', (done) => {
  const axium = createAxium('chainConceptTest', [createCounterConcept(), createChainConcept()], true, true);
  let count = 0;
  let willDispatch = true;
  const sub = axium.subscribe((concepts: Concepts) => {
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
      const counter = selectState<CounterState>(concepts, counterName);
      expect(counter?.count).toBe(2);
      setTimeout(() => {done();}, 500);
      axium.close();
      sub.unsubscribe();
    }
  });
});
/*#>*/