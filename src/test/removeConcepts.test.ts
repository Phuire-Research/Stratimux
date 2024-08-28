/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the axium can properly remove concepts from its current load.
$>*/
/*<#*/
import { createAxium, getAxiumState } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import {
  addConceptsToRemovalQueThenBlockStrategy,
  removeConceptsViaQueThenUnblockTopic
} from '../concepts/axium/strategies/removeConcept.strategy';
import { forEachConcept } from '../model/concept';

test('Axium remove Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumRemoveConceptsTest',
    { counter: createCounterConcept() },
    { logging: true, storeDialog: true, dynamic: true }
  );
  const plan = axium.plan('Remove Concepts Stage', ({stage, stageO, e__, k__}) => [
    stageO(() => e__.axiumKick()),
    stage(({concepts, dispatch, e}) => {
      console.log('REMOVE');
      dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(e, concepts, {counter: createCounterConcept()})
        ), {
          iterateStage: true
        }
      );
    }),
    stage(({concepts, d}) => {
      const axiumState = getAxiumState(concepts);
      console.log('VERIFY', axiumState.lastStrategy, '\n', removeConceptsViaQueThenUnblockTopic);
      if (axiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
        let exists = false;
        forEachConcept(concepts, (concept => {
          if (concept.name === counterName) {
            exists = true;
          }
        }));
        expect(exists).toBe(false);
        expect(Object.keys(d).length).toBe(1);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        axium.close();
      }
    }, { selectors: [k__.lastStrategy] })
  ]);
});
/*#>*/