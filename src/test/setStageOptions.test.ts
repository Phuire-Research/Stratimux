/*<$
For the asynchronous graph programming framework Stratimux, generate a test that the setStageOption derivatives.are functioning as intended
$>*/
/*<#*/
import { createAxium, getAxiumState, isAxiumOpen } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectSlice, selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { createStage } from '../model/stagePlanner';
import { axiumSelectLastStrategy } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { initializeTopic } from '../concepts/axium/strategies/initialization.strategy';

test('Axium setStageSelectors Test', (done) => {
  let tally = 0;
  const axium = createAxium('axiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan using setStageSelectors',
    ({stage}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        if (isAxiumOpen(concepts)) {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true,
              setStageSelectors: {
                stage: 1,
                selectors: [axiumSelectLastStrategy]
              }
            });
          } else {
            stagePlanner.conclude();
            expect(false).toBe(true);
            setTimeout(() => {done();}, 500);
          }
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      stage(({concepts, changes}) => {
        tally++;
        if (tally === 1) {
          expect(changes?.length).toBe(0);
        }
        const axiumState = getAxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (axiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          expect(tally).toBe(2);
          expect(changes?.length).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          axium.close();
        }
      })
    ]);
});

test('Axium setStageBeat Test', (done) => {
  let tally = 0;
  const axium = createAxium('axiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan using setStageBeat',
    ({stage}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        if (isAxiumOpen(concepts)) {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true,
              setStageBeat: {
                stage: 1,
                beat: 300
              }
            });
          } else {
            stagePlanner.conclude();
            expect(false).toBe(true);
            setTimeout(() => {done();}, 500);
          }
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      stage(({concepts}) => {
        const axiumState = getAxiumState(concepts);
        tally++;
        const counter = selectState<CounterState>(concepts, counterName);
        if (axiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          expect(tally).toBe(2);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          axium.close();
        }
      })
    ]);
});

test('Axium setStagePriority Test', (done) => {
  const axium = createAxium('axiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  let ready = false;
  let tally = 0;
  const plan = axium.plan('Counting Strategy Plan using setStagePriority',
    ({stage}) => [
      stage(({stagePlanner, dispatch, d}) => {
        if (ready) {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true,
              setStagePriority: {
                stage: 1,
                priority: 0
              }
            });
          } else {
            stagePlanner.conclude();
            expect(false).toBe(true);
            setTimeout(() => {done();}, 500);
          }
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      stage(() => {
        expect(tally).toBe(1);
        tally++;
        plan.conclude();
      }, {
        priority: Infinity
      })
    ]);
  const planTwo = axium.plan('Counting Strategy Plan using setStagePriority Two',
    ({stage}) => [
      stage(({stagePlanner, dispatch, d}) => {
        if (ready) {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true,
              setStagePriority: {
                stage: 1,
                priority: Infinity
              }
            });
          } else {
            stagePlanner.conclude();
            expect(false).toBe(true);
            setTimeout(() => {done();}, 500);
          }
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      stage(() => {
        expect(tally).toBe(0);
        tally++;
        setTimeout(() => {done();}, 500);
        planTwo.conclude();
        axium.close();
      }, {
        priority: 0
      })
    ]);
  ready = true;
  axium.dispatch(axium.deck.axium.e.axiumKick());
});
/*#>*/
