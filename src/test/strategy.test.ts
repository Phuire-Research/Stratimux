import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, primedCountingStrategy, counterKey } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';

test('Axium Counting Strategy Test', (done) => {
  let count = 0;
  const axium = createAxium([createCounterConcept()]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    if (count ===  1) {
      axium.dispatch(strategyBegin(countingStrategy()));
    }
    const counter = selectState<Counter>(concepts, counterKey);
    console.log(`Fires: ${count} Count: ${counter.count}`);
    if (count === 6) {
      console.log(`FINAL: Fires: ${count} Count: ${counter.count}`);
      expect(counter.count).toBe(1);
    }
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.lastStrategy === countingTopic) {
      console.log(axiumState.dialog);
      sub.unsubscribe();
      done();
    }
  });
});
