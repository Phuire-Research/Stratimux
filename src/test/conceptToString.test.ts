import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { conceptToString, conceptsToString } from '../model/concept';

test('Axium Counting Strategy Test', (done) => {
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], true, true);
  const sub = axium.subscribe(concepts => {
    console.log('CONCEPTS:', conceptsToString(concepts));
    expect(true).toBe(true);
    sub.unsubscribe();
    setTimeout(() => {
      done();
    }, 500);
  });
});
