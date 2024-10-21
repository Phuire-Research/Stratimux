/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that the Muxium can add concepts into its conceptual sets.
$>*/
/*<#*/
import { muxification, getMuxiumState } from '../model/muxium/muxium';
import { select, selectState } from '../model/selectors/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterDeck } from '../concepts/counter/counter.concept';
import { addConceptsToAddQueThenBlockStrategy } from '../concepts/muxium/strategies/addConcept.strategy';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { forEachConcept } from '../model/concept/concept';
import { muxiumSelectOpen } from '../concepts/muxium/muxium.selector';
import { Deck } from '../model/deck';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

test('Muxium add Concepts Strategy Test', (done) => {
  const muxium = muxification('muxiumAddConceptTest', {}, {logging: true, storeDialog: true, dynamic: true});
  const plan = muxium.plan('Add Concepts Stage', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
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
      if (select.slice(concepts, muxiumSelectOpen)) {
        let exists = false;
        console.log('CHECK CONCEPTS', concepts);
        forEachConcept(concepts, (concept) => {
          if (concept.name === counterName) {
            exists = true;
            console.log('Check: ', Object.keys(d));
            const str = countingStrategy(d as Deck<MuxiumDeck & CounterDeck>);
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
    }, { selectors: [muxiumSelectOpen] }),
    stage(({concepts, d}) => {
      const muxiumState = getMuxiumState(concepts);
      console.log('Check for final counting topic', muxiumState.lastStrategy, concepts[1]?.state);
      if (muxiumState.lastStrategy === countingTopic) {
        console.log('CHECK CONCEPTS', concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('FINAL COUNT', counter?.count);
        expect(counter?.count).toBe(1);
        expect(Object.keys(d).length).toBe(2);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        muxium.close();
      }
    })
  ]);
});
/*#>*/