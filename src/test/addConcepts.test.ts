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
  let notFired = true;
  const axium = createAxium([], true, true);
  const sub = axium.subscribe((concepts: Concept[]) => {
    // const counter = selectState<Counter>(concepts, counterConcept.key);
    if (count === 0) {
      axium.dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(concepts,[createCounterConcept()])
        )
      );
    }
    if ((concepts[0].state as AxiumState).open && count > 2 && notFired) {
      let exists = false;
      if (concepts[1].key === counterKey) {
        notFired = false;
        exists = true;
        axium.dispatch(strategyBegin(countingStrategy()));
      }
      expect(exists).toBe(true);
      // sub.unsubscribe();
    }
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.lastStrategy === countingTopic) {
      const counter = selectState<Counter>(concepts, counterKey);
      expect(counter.count).toBe(1);
      setTimeout(() => {done();}, 500);
      sub.unsubscribe();
    }
    count++;
  });
});
