/*<$
For the asynchronous graph programming framework Stratimux, generate a test that the setStageOption derivatives.are functioning as intended
$>*/
/*<#*/
import { createAxium, isAxiumOpen } from '../model/axium';
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
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan using setStageSelectors',
    ({stage}) => [
      stage(({concepts, dispatch}) => {
        if (isAxiumOpen(concepts)) {
          dispatch(strategyBegin(countingStrategy()), {
            iterateStage: true,
            setStageSelectors: {
              stage: 1,
              selectors: [axiumSelectLastStrategy]
            }
          });
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      stage(({concepts, changes}) => {
        tally++;
        if (tally === 1) {
          expect(changes?.length).toBe(0);
        }
        const axiumState = concepts[0].state as AxiumState;
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
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan using setStageBeat',
    ({stage}) => [
      stage(({concepts, dispatch}) => {
        if (isAxiumOpen(concepts)) {
          dispatch(strategyBegin(countingStrategy()), {
            iterateStage: true,
            setStageBeat: {
              stage: 1,
              beat: 300
            }
          });
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      stage(({concepts}) => {
        const axiumState = concepts[0].state as AxiumState;
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
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], {logging: true, storeDialog: true});
  let ready = false;
  let tally = 0;
  const plan = axium.plan('Counting Strategy Plan using setStagePriority',
    ({stage}) => [
      stage(({dispatch, ax}) => {
        if (ready) {
          dispatch(strategyBegin(countingStrategy()), {
            iterateStage: true,
            setStagePriority: {
              stage: 1,
              priority: 0
            }
          });
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
      stage(({dispatch}) => {
        if (ready) {
          dispatch(strategyBegin(countingStrategy()), {
            iterateStage: true,
            setStagePriority: {
              stage: 1,
              priority: Infinity
            }
          });
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
  axium.dispatch(axiumKick());
});
/*#>*/
