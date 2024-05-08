/*<$
For the asynchronous graph programming framework Stratimux,
generate a test to that ensures the functionality of is concept loaded and are concept loaded helper functions.
$>*/
/*<#*/
import { counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createAxium } from '../model/axium';
import { areConceptsLoaded, chainName, createChainConcept, isConceptLoaded } from '../index';
import { createStage } from '../model/stagePlanner';

test('Concepts exists', (done) => {
  const axium = createAxium('Mock Axium', [createCounterConcept()]);
  const plan = axium.plan('Check Concepts', [
    createStage((concepts, __) => {
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
  const axium = createAxium('Mock Axium', [createCounterConcept(), createChainConcept()]);
  const plan = axium.plan('Check Concepts', [
    createStage((concepts, __) => {
      if (areConceptsLoaded(concepts, [counterName, chainName])) {
        expect(true).toBe(true);
        plan.conclude();
        axium.close();
        done();
      } else {
        expect(false).toBe(true);
        plan.conclude();
        axium.close();
        done();
      }
    }),
  ]);
});
/*#>*/