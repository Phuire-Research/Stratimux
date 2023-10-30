import { counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createAxium } from '../model/axium';
import { areConceptsLoaded, chainName, createChainConcept, isConceptLoaded } from '../index';

test('Concepts exists', (done) => {
  const axium = createAxium('Mock Axium', [createCounterConcept()]);
  axium.stage('Check Concepts', [
    (concepts, __) => {
      if (isConceptLoaded(concepts, counterName)) {
        expect(true).toBe(true);
        done();
      } else {
        expect(false).toBe(true);
        done();
      }
    },
  ]);
});

test('Concepts exists', (done) => {
  const axium = createAxium('Mock Axium', [createCounterConcept(), createChainConcept()]);
  const stage = axium.stage('Check Concepts', [
    (concepts, __) => {
      if (areConceptsLoaded(concepts, [counterName, chainName])) {
        expect(true).toBe(true);
        stage.conclude();
        axium.close();
        done();
      } else {
        expect(false).toBe(true);
        stage.conclude();
        axium.close();
        done();
      }
    },
  ]);
});
