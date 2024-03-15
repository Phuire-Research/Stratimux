/*<$
For the graph programming framework Stratimux, generate a test to ensure that the axium can properly remove concepts from its current load.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import {
  addConceptsToRemovalQueThenBlockStrategy,
  removeConceptsViaQueThenUnblockTopic
} from '../concepts/axium/strategies/removeConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';
import { forEachConcept } from '../model/concept';
import { createStage } from '../model/stagePlanner';

test('Axium remove Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumRemoveConceptsTest', [createCounterConcept()], true, true);
  const plan = axium.plan('Remove Concepts Stage',[
    createStage((concepts, dispatch) => {
      dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(concepts,[createCounterConcept()])
        ), {
          iterateStage: true
        }
      );
    }),
    createStage((concepts) => {
      const axiumState = concepts[0].state as AxiumState;
      if (axiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
        let exists = false;
        forEachConcept(concepts, (concept => {
          if (concept.name === counterName) {
            exists = true;
          }
        }));
        expect(exists).toBe(false);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        axium.close();
      }
    })
  ]);
});
/*#>*/