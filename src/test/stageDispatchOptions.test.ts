/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure the stage planner and its options are working as intended.
$>*/
/*<#*/
import { createAxium, getAxiumState } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';
import { CounterState, createCounterConcept, counterName } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';

test('Axium Stage Dispatch Options Test', (done) => {
  let runCount = 0;
  const axium = createAxium('axiumStageDispatchOptionsTest', {counter: createCounterConcept()}, {logging: true});
  const sub = axium.subscribe((concepts) => {
    const axiumState = getAxiumState(concepts);
    if (axiumState.badPlans.length > 0) {
      const badPlan = axiumState.badPlans[0];
      const counter = selectState<CounterState>(concepts, counterName);
      console.log('Stage Ran Away, badPlans.length: ', axiumState.badPlans.length, 'Count: ', counter?.count);
      plan.conclude();
      sub.unsubscribe();
      expect(badPlan.stageFailed).toBe(2);
      expect(counter?.count).toBe(2);
      setTimeout(() => {done();}, 500);
    }
  });
  const plan = axium.plan('Stage DispatchOptions Test',
    ({stage}) => [
      stage(({concepts, dispatch, d}) => {
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('Stage 1 ', counter, runCount);
        dispatch(d.counter.e.counterAdd(), {
          iterateStage: true
        });
      }),
      stage(({concepts, dispatch, d}) => {
        runCount++;
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('Stage 2 ', counter, runCount);
        // Sets count to 2 and only runs once per state update
        dispatch(d.counter.e.counterAdd(), {
          runOnce: true
        });
        // Will wait until count is set to 2, then set the Stage Explicitly to the third Step counting from 0.
        if (selectSlice(concepts, counterSelectCount) === 2) {
          dispatch(d.counter.e.counterAdd(), {
            setStage: 2,
            // Requires throttle, because the previous action is of the same type, but runs only once.
            throttle: 1
          });
        }
        // }
      }),
      stage(({concepts, dispatch, d}) => {
        runCount++;
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('Should run twice, Stage 3 ', counter, runCount);
        // Will cause an action overflow forcing the stage to close and add itself to badPlans
        dispatch(d.counter.e.counterSubtract(), {
          // Enabling will cause this test to timeout via the subscription watching for badPlans to never be ran.
          // throttle: 500
          // This demonstrates the fault resistance of the Stage paradigm, despite Stratimux's recursive functionality.
        });
        // This dispatch will be invalidated and never dispatched due to the effect of action overflow of the above.
        dispatch(d.counter.e.counterAdd(), {});
        console.log(
          'Will also run twice. 1st will be before "Stage Ran Away,"',
          'and after "Should run twice." The 2nd will be final console log output.'
        );
      })
    ]);
});
/*#>*/