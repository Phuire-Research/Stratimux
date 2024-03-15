/*<$
For the graph programming framework Stratimux, generate a test that ensures that the Axium can add concepts into its conceptual sets.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/axium/strategies/addConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { forEachConcept } from '../model/concept';
import { createStage } from '../model/stagePlanner';

test('Axium add Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumAddConceptTest',[], true, true);
  const plan = axium.plan('Add Concepts Stage',[
    createStage((concepts, dispatch) => {
      dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(concepts,[createCounterConcept()])
        ),
        {
          iterateStage: true
        }
      );
    }),
    createStage((concepts, dispatch) => {
      let exists = false;
      console.log('CHECK CONCEPTS', concepts);
      forEachConcept(concepts, (concept) => {
        if (concept.name === counterName) {
          exists = true;
          dispatch(strategyBegin(countingStrategy()), {
            iterateStage: true
          });
          expect(exists).toBe(true);
        }
      });
    }),
    createStage((concepts) => {
      const axiumState = concepts[0].state as AxiumState;
      if (axiumState.lastStrategy === countingTopic) {
        const counter = selectState<CounterState>(concepts, counterName);
        expect(counter?.count).toBe(1);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        axium.close();
      }
    })
  ]);
});
/*#>*/