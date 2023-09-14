import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';

test('Axium Counting Strategy Test', (done) => {
  let count = 0;
  const axium = createAxium([createCounterConcept()], true, true);
  const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    if (count ===  1) {
      axium.dispatch(strategyBegin(countingStrategy()));
    }
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.lastStrategy === countingTopic) {
      const counter = selectState<Counter>(concepts, counterName);
      expect(counter.count).toBe(1);
      setTimeout(() => {done();}, 500);
      sub.unsubscribe();
    }
  });
});
