import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, primedCountingStrategy, counterKey } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/axium/strategies/addConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';

test('Axium add Concepts Strategy Test', (done) => {
  let count = 0;
  const axium = createAxium([]);
  console.log('Add Concepts Begin');
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    // const counter = selectState<Counter>(concepts, counterConcept.key);
    console.log(`${count}: Loaded Concepts: ${concepts.length}`);
    if (count === 1) {
      axium.dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(concepts,[createCounterConcept()])
        )
      );
    }
    if (count === 3) {
      let exists = false;
      if (concepts[1].key === counterKey) {
        exists = true;
        axium.dispatch(strategyBegin(countingStrategy()));
      }
      expect(exists).toBe(true);
      // sub.unsubscribe();
    }
    if (count > 3) {
      const counter = selectState<Counter>(concepts, counterKey);
      console.log('Counter: ', counter.count);
    }
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.lastStrategy === countingTopic) {
      const counter = selectState<Counter>(concepts, counterKey);
      expect(counter.count).toBe(1);
      done();
    }
  });
});
