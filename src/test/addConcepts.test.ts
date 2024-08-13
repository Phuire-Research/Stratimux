/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that the Axium can add concepts into its conceptual sets.
$>*/
/*<#*/
import { AxiumDeck, createAxium, getAxiumState } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { select, selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterDeck } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/axium/strategies/addConcept.strategy';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { forEachConcept } from '../model/concept';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { Deck } from '../model/deck';

test('Axium add Concepts Strategy Test', (done) => {
  const axium = createAxium('axiumAddConceptTest', {}, {logging: true, storeDialog: true, dynamic: true});
  const plan = axium.plan('Add Concepts Stage', ({stage, stageO, e__}) => [
    stageO(() => e__.axiumKick()),
    stage(({concepts, dispatch, d, e}) => {
      console.log('Add Counter Concept');
      expect(Object.keys(d).length).toBe(1);
      dispatch(
        strategyBegin(
          addConceptsToAddQueThenBlockStrategy(e, concepts, { counter: createCounterConcept()})
        ),
        {
          iterateStage: true
        }
      );
    }),
    stage(({stagePlanner, concepts, dispatch, d}) => {
      if (select.slice(concepts, axiumSelectOpen)) {
        let exists = false;
        console.log('CHECK CONCEPTS', concepts);
        forEachConcept(concepts, (concept) => {
          if (concept.name === counterName) {
            exists = true;
            const str = countingStrategy(d as Deck<AxiumDeck & CounterDeck>);
            console.log('Dispatched', str);
            if (str) {
              dispatch(strategyBegin(str), {
                iterateStage: true
              });
            } else {
              stagePlanner.conclude();
              expect(false).toBe(true);
              setTimeout(() => {done();}, 500);
            }
            expect(exists).toBe(true);
          }
        });
      }
    }, { selectors: [axiumSelectOpen] }),
    stage(({concepts, d}) => {
      const axiumState = getAxiumState(concepts);
      console.log('Check for final counting topic', axiumState.lastStrategy, concepts[1]?.state);
      if (axiumState.lastStrategy === countingTopic) {
        console.log('CHECK CONCEPTS', concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('FINAL COUNT', counter?.count);
        expect(counter?.count).toBe(1);
        expect(Object.keys(d).length).toBe(2);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        axium.close();
      }
    })
  ]);
});
/*#>*/