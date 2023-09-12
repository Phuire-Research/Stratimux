import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, primedCountingStrategy, counterKey } from '../concepts/counter/counter.concept';
import {
  addConceptsToRemovalQueThenBlockStrategy,
  removeConceptsViaQueThenUnblockTopic
} from '../concepts/axium/strategies/removeConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';

test('Axium remove Concepts Strategy Test', (done) => {
  let dispatched = false;
  const axium = createAxium([createCounterConcept()], true, true);
  console.log('Remove Concepts Begin');
  const sub = axium.subscribe((concepts: Concept[]) => {
    // const counter = selectState<Counter>(concepts, counterConcept.key);
    if (!dispatched) {
      dispatched = true;
      axium.dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(concepts,[createCounterConcept()])
        )
      );
    }
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
      let exists = false;
      concepts.forEach(concept => {
        if (concept.key === counterKey) {
          exists = true;
        }
      });
      expect(exists).toBe(false);
      done();
    }
    // sub.unsubscribe();
  });
});
