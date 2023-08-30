import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept';

test('Axium Counting Strategy Test', (done) => {
  let count = 0;
  const axium = createAxium([counterConcept]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    if (count ===  1) {
      axium.dispatch(strategyBegin(countingStrategy()));
    }
    const counter = selectState<Counter>(concepts, counterConcept.key);
    console.log(`Fires: ${count} Count: ${counter.count}`);
    if (count === 6) {
      console.log(`FINAL: Fires: ${count} Count: ${counter.count}`);
      expect(counter.count).toBe(1);
      sub.unsubscribe();
      done();
    }
  });
});
