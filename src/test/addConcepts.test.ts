/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that the Axium can add concepts into its conceptual sets.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { select, selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/axium/strategies/addConcept.strategy';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { forEachConcept } from '../model/concept';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';

test('Axium add Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumAddConceptTest',[], {logging: true, storeDialog: true});
  const plan = axium.plan('Add Concepts Stage', () => [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((concepts, dispatch) => {
      console.log('Add Counter Concept');
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
      if (select.slice(concepts, axiumSelectOpen)) {
        let exists = false;
        console.log('CHECK CONCEPTS', concepts);
        forEachConcept(concepts, (concept) => {
          if (concept.name === counterName) {
            exists = true;
            const str = countingStrategy();
            console.log('Dispatched', str);
            dispatch(strategyBegin(str), {
              iterateStage: true
            });
            expect(exists).toBe(true);
          }
        });
      }
    }, { selectors: [axiumSelectOpen] }),
    createStage((concepts) => {
      const axiumState = concepts[0].state as AxiumState;
      console.log('Check for final counting topic', axiumState.lastStrategy, concepts[1]?.state);
      if (axiumState.lastStrategy === countingTopic) {
        console.log('CHECK CONCEPTS', concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('SHOULD HIT, but isn\'t');
        expect(counter?.count).toBe(1);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        axium.close();
      }
    })
  ]);
});
/*#>*/