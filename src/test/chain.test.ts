/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept, generate a test ensure that chain is working as intended.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { Concepts } from '../model/concept';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import { ChainState, chainName, createChainConcept } from '../concepts/chain/chain.concept';

test('Axium Test', (done) => {
  const axium = createAxium('chainConceptTest',
    {counter: createCounterConcept(), chain: createChainConcept()},
    {logging: true, storeDialog: true}
  );
  let count = 0;
  let willDispatch = true;
  const sub = axium.subscribe((concepts: Concepts) => {
    console.log(selectState<ChainState>(concepts, chainName));
    count++;
    if (willDispatch) {
      willDispatch = false;
      const add = axium.deck.counter.e.counterAdd();
      const subtract = axium.deck.counter.e.counterSubtract();
      const end = axium.deck.chain.e.chainEnd();
      const prepareChain =
        axium.deck.chain.e.chainPrepareChain({
          actions: [
            add,
            add,
            subtract,
            add,
            subtract,
            add,
            end
          ]
        });
      axium.dispatch(prepareChain);
    }
    else if (selectState<ChainState>(concepts, chainName)?.end) {
      const counter = selectState<CounterState>(concepts, counterName);
      expect(counter?.count).toBe(2);
      setTimeout(() => {done();}, 500);
      axium.close();
      sub.unsubscribe();
    }
  });
});
/*#>*/