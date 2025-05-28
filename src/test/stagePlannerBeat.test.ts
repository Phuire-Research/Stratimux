
/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that you can create a stage planner that sets the beat parameter
of the plan. The beat will ensure that within a span of time the first notification of state change will be observed.
But any new additional changes to state will be debounced for the beat duration.
But if the beat has not been notified for a period. The first notification will go through and start this process over again.
This is a combination of throttle and debounce.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { selectSlice, selectState } from '../model/selector/selector';
import { muxiumSelectOpen } from '../concepts/muxium/muxium.selector';
import { CounterDeck, CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createStage } from '../model/stagePlanner/stagePlannerHelpers';
jest.setTimeout(10000);

test('Stage Planner Beat Test', (done) => {
  let timerActive = false;
  const muxium = muxification('muxium test stage planner beat', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});
  const beat = 105;
  const plan = muxium.plan<CounterDeck>('Stage Planner Beat Test', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({concepts, dispatch, e}) => {
      console.log('HIT 1');
      timerActive = true;
      setTimeout(() => {
        console.log('FIRE');
        timerActive = false;
      }, 1000);
      if (selectSlice(concepts, muxiumSelectOpen)) {
        dispatch(e.muxiumKick(), {
          iterateStage: true,
        });
      }
    }, {beat}),
    stage(({dispatch, d}) => {
      console.log('HIT 2');
      dispatch(d.counter.e.counterAdd(), {
        iterateStage: true
      });
    }, {beat}),
    stage(({concepts, dispatch, d, e}) => {
      // console.log('HIT 3', timerActive, selectState<CounterState>(concepts, counterName));
      if (!timerActive) {
        const state = selectState<CounterState>(concepts, counterName);
        if (state) {
          expect(state.count).toBe(9);
          setTimeout(() => done(), 1000);
          dispatch(e.muxiumPreClose({exit: false}), {
            iterateStage: true
          });
          plan.conclude();
        }
      } else {
        dispatch(d.counter.e.counterAdd(), {
          throttle: 1
        });
      }
    }, {beat}),
    stage(() => {
      console.log('HIT 4');
      //
    }, {beat})
  ]);
});
/*#>*/