/*<$
For the asynchronous graph programming framework Stratimux, generate a test that the setStageOption derivatives.are functioning as intended
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { getMuxiumState, isMuxiumOpen } from '../model/muxium/muxiumHelpers';
import { selectState } from '../model/selector/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterQualities } from '../concepts/counter/counter.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { Concept } from '../model/concept/concept.type';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

test('Muxium setStageSelectors Test', (done) => {
  let tally = 0;
  const muxium = muxification('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});

  type DECK = {
    counter: Concept<CounterState, CounterQualities>
  };

  const plan = muxium.plan<DECK>('Counting Strategy Plan using setStageSelectors',
    ({stage, d__}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        if (isMuxiumOpen(concepts)) {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true,
              setStageSelectors: {
                stage: 1,
                selectors: [d.muxium.k.lastStrategy]
              }
            });
          } else {
            stagePlanner.conclude();
            expect(false).toBe(true);
            setTimeout(() => {done();}, 500);
          }
        }
      }, {selectors: [d__.muxium.k.lastStrategy]}),
      stage(({concepts, changes}) => {
        tally++;
        if (tally === 1) {
          expect(changes?.length).toBe(0);
        }
        const muxiumState = getMuxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (muxiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          expect(tally).toBe(2);
          expect(changes?.length).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          muxium.close();
        }
      })
    ]);
});

test('Muxium setStageBeat Test', (done) => {
  let tally = 0;
  const muxium = muxification('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});

  type DECK = {
    counter: Concept<CounterState, CounterQualities>
  };

  const plan = muxium.plan<DECK>('Counting Strategy Plan using setStageBeat',
    ({stage, d__}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        if (isMuxiumOpen(concepts)) {
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
      }, {selectors: [d__.muxium.k.lastStrategy]}),
      stage(({concepts}) => {
        const muxiumState = getMuxiumState(concepts);
        tally++;
        const counter = selectState<CounterState>(concepts, counterName);
        if (muxiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          expect(tally).toBe(2);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          muxium.close();
        }
      })
    ]);
});

test('Muxium setStagePriority Test', (done) => {
  const muxium = muxification('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});

  type DECK = {
    counter: Concept<CounterState, CounterQualities>
  };

  let ready = false;
  let tally = 0;
  const plan = muxium.plan<DECK>('Counting Strategy Plan using setStagePriority',
    ({stage, d__}) => [
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
      }, {selectors: [d__.muxium.k.lastStrategy]}),
      stage(() => {
        expect(tally).toBe(1);
        tally++;
        plan.conclude();
      }, {
        priority: Infinity
      })
    ]);
  const planTwo = muxium.plan<DECK>('Counting Strategy Plan using setStagePriority Two',
    ({stage, d__}) => [
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
      }, {selectors: [d__.muxium.k.lastStrategy]}),
      stage(() => {
        expect(tally).toBe(0);
        tally++;
        setTimeout(() => {done();}, 500);
        planTwo.conclude();
        muxium.close();
      }, {
        priority: 0
      })
    ]);
  ready = true;
  muxium.dispatch(muxium.e.muxiumKick());
});
/*#>*/
