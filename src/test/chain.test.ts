/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept, generate a test ensure that chain is working as intended.
$>*/
/*<#*/
import { muxification } from '../model/muxium';
import { Concepts } from '../model/concept';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import { ChainState, chainName, createChainConcept } from '../concepts/chain/chain.concept';

test('Muxium Test', (done) => {
  const muxium = muxification('chainConceptTest',
    {counter: createCounterConcept(), chain: createChainConcept()},
    {logging: true, storeDialog: true}
  );
  let count = 0;
  let willDispatch = true;
  const sub = muxium.subscribe((concepts: Concepts) => {
    console.log(selectState<ChainState>(concepts, chainName));
    count++;
    if (willDispatch) {
      willDispatch = false;
      const add = muxium.deck.d.counter.e.counterAdd();
      const subtract = muxium.deck.d.counter.e.counterSubtract();
      const end = muxium.deck.d.chain.e.chainEnd();
      const prepareChain =
        muxium.deck.d.chain.e.chainPrepareChain({
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
      muxium.dispatch(prepareChain);
    }
    else if (selectState<ChainState>(concepts, chainName)?.end) {
      const counter = selectState<CounterState>(concepts, counterName);
      expect(counter?.count).toBe(2);
      setTimeout(() => {done();}, 500);
      muxium.close();
      sub.unsubscribe();
    }
  });
});
/*#>*/