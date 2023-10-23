import { counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createAxium } from '../model/axium';
import { isConceptLoaded } from '../index';

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
