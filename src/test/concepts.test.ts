/*<$
For the asynchronous graph programming framework Stratimux,
generate a test to that ensures the functionality of is concept loaded and are concept loaded helper functions.
$>*/
/*<#*/
import { counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { muxification } from '../model/muxium';
import { areConceptsLoaded, chainName, createChainConcept, isConceptLoaded } from '../index';
import { createStage } from '../model/stagePlanner';

test('Concepts exists', (done) => {
  const muxium = muxification('Mock Muxium', {counter: createCounterConcept()});
  const plan = muxium.plan('Check Concepts', ({stage}) => [
    stage(({concepts}) => {
      if (isConceptLoaded(concepts, counterName)) {
        expect(true).toBe(true);
        done();
        plan.conclude();
      } else {
        expect(false).toBe(true);
        done();
        plan.conclude();
      }
    }),
  ]);
});

test('Concepts exists', (done) => {
  const muxium = muxification('Mock Muxium', {counter: createCounterConcept(), chain: createChainConcept()});
  const plan = muxium.plan('Check Concepts', ({stage}) => [
    stage(({concepts}) => {
      if (areConceptsLoaded(concepts, [counterName, chainName])) {
        expect(true).toBe(true);
        plan.conclude();
        muxium.close();
        done();
      } else {
        expect(false).toBe(true);
        plan.conclude();
        muxium.close();
        done();
      }
    }),
  ]);
});
/*#>*/