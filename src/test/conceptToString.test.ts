import { createAxium } from '../model/axium';
import { createCounterConcept } from '../concepts/counter/counter.concept';
import { conceptsToString } from '../model/concept';

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
