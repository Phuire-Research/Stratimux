import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import {
  addConceptsToRemovalQueThenBlockStrategy,
  removeConceptsViaQueThenUnblockTopic
} from '../concepts/axium/strategies/removeConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';

test('Axium remove Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumRemoveConceptsTest', [createCounterConcept()], true, true);
  const plan = axium.stage('Remove Concepts Stage',[
    (concepts, dispatch) => {
      dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(concepts,[createCounterConcept()])
        ), {
          iterateStage: true
        }
      );
    },
    (concepts) => {
      const axiumState = concepts[0].state as AxiumState;
      // console.log(concepts);
      if (axiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
        let exists = false;
        concepts.forEach(concept => {
          if (concept.name === counterName) {
            exists = true;
          }
        });
        expect(exists).toBe(false);
        setTimeout(() => {done();}, 500);
        plan.conclude();
      }
    }
  ]);
});
