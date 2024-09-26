/*<$
For the asynchronous graph programming framework Stratimux, generate a test that logs how a concept would be parsed to a stream to the console.
$>*/
/*<#*/
import { muxification } from '../model/muxium';
import { createCounterConcept } from '../concepts/counter/counter.concept';
import { conceptsToString } from '../model/concept';

test('Muxium Counting Strategy Test', (done) => {
  const muxium = muxification('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  const sub = muxium.subscribe(concepts => {
    console.log('CONCEPTS:', conceptsToString(concepts));
    expect(true).toBe(true);
    sub.unsubscribe();
    setTimeout(() => {
      done();
    }, 500);
  });
});
/*#>*/