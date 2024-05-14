/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the axium can properly remove concepts from its current load.
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
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';

test('Axium remove Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumRemoveConceptsTest', [createCounterConcept()], { logging: true, storeDialog: true });
  const plan = axium.plan('Remove Concepts Stage',[
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((concepts, dispatch) => {
      console.log('REMOVE');
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
      console.log('VERIFY', axiumState.lastStrategy);
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