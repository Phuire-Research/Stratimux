
/*<$
For the graph programming framework Stratimux, generate a test to ensure that you can create a stage planner that sets the beat parameter
of the plan. The beat will ensure that within a span of time the first notification of state change will be observed.
But any new additional changes to state will be debounced for the beat duration.
But if the beat has not been notified for a period. The first notification will go through and start this process over again.
This is a combination of throttle and debounce.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { counterAdd } from '../concepts/counter/qualities/add.quality';

test('Stage Planner Beat Test', (done) => {
  let timerActive = false;
  const axium = createAxium('axium test stage planner beat', [
    createCounterConcept()
  ], true, true);
  const plan = axium.stage('Stage Planner Beat Test', [
    (___, dispatch) => {
      timerActive = true;
      setTimeout(() => {
        timerActive = false;
      }, 1000);
      dispatch(axiumKick(), {
        iterateStage: true,
        on: {
          selector: axiumSelectOpen,
          expected: true
        },
      });
    },
    (___, dispatch) => {
      dispatch(counterAdd(), {
        iterateStage: true
      });
    },
    (concepts, dispatch) => {
      if (!timerActive) {
        const state = selectState<CounterState>(concepts, counterName);
        if (state) {
          expect(state.count).toBe(10);
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
    },
    () => {
      //
    }
  ], 93);
});
/*#>*/