
/*<$
For the graph programming framework Stratimux, generate a test to ensure that you can create a stage planner that sets the beat parameter
of the plan. The beat will ensure that within a span of time the first notification of state change will be observed.
But any new additional changes to state will be debounced for the beat duration.
But if the beat has not been notified for a period. The first notification will go through and start this process over again.
This is a combination of throttle and debounce.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { counterAdd } from '../concepts/counter/qualities/add.quality';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
jest.setTimeout(10000);

test('Stage Planner Beat Test', (done) => {
  let timerActive = false;
  const axium = createAxium('axium test stage planner beat', [
    createCounterConcept()
  ], true, true);
  const beat = 105;
  const plan = axium.plan('Stage Planner Beat Test', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((concepts, dispatch) => {
      console.log('HIT 1');
      timerActive = true;
      setTimeout(() => {
        console.log('FIRE');
        timerActive = false;
      }, 1000);
      if (selectSlice(concepts, axiumSelectOpen)) {
        dispatch(axiumKick(), {
          iterateStage: true,
        });
      }
    }, {beat}),
    createStage((___, dispatch) => {
      console.log('HIT 2');
      dispatch(counterAdd(), {
        iterateStage: true
      });
    }, {beat}),
    createStage((concepts, dispatch) => {
      // console.log('HIT 3', timerActive, selectState<CounterState>(concepts, counterName));
      if (!timerActive) {
        const state = selectState<CounterState>(concepts, counterName);
        if (state) {
          expect(state.count).toBe(9);
          setTimeout(() => done(), 1000);
          dispatch(axiumPreClose({exit: false}), {
            iterateStage: true
          });
          plan.conclude();
        }
      } else {
        dispatch(counterAdd(), {
          throttle: 1
        });
      }
    }, {beat}),
    createStage(() => {
      console.log('HIT 4');
      //
    }, {beat})
  ]);
});
/*#>*/