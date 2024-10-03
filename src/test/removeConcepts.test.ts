/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the muxium can properly remove concepts from its current load.
$>*/
/*<#*/
import { muxification, getMuxiumState } from '../model/muxium';
import { strategyBegin } from '../model/actionStrategy';
import { createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import {
  addConceptsToRemovalQueThenBlockStrategy,
  removeConceptsViaQueThenUnblockTopic
} from '../concepts/muxium/strategies/removeConcept.strategy';
import { forEachConcept } from '../model/concept';

test('Muxium remove Concepts Strategy Test', (done) => {
  const muxium = muxification('muxiumRemoveConceptsTest',
    { counter: createCounterConcept() },
    { logging: true, storeDialog: true, dynamic: true }
  );
  const plan = muxium.plan('Remove Concepts Stage', ({stage, stageO, e__, k__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({concepts, dispatch, e, k}) => {
      console.log('REMOVE', e,k);
      dispatch(
        strategyBegin(
          addConceptsToRemovalQueThenBlockStrategy(e, concepts, {counter: createCounterConcept()})
        ), {
          iterateStage: true
        }
      );
    }),
    stage(({concepts, d}) => {
      const muxiumState = getMuxiumState(concepts);
      console.log('VERIFY', muxiumState.lastStrategy, '\n', removeConceptsViaQueThenUnblockTopic);
      if (muxiumState.lastStrategy === removeConceptsViaQueThenUnblockTopic) {
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
        muxium.close();
      }
    }, { selectors: [k__.lastStrategy] })
  ]);
});
/*#>*/