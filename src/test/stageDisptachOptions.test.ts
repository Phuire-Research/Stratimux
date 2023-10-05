import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { counterAdd } from '../concepts/counter/qualities/add.quality';
import { counterSubtract } from '../concepts/counter/qualities/subtract.quality';
import { counterSelectCount } from '../concepts/counter/counter.selector';

test('Axium Stage Dispatch Options Test', (done) => {
  let runCount = 0;
  const axium = createAxium('axiumStageDispatchOptionsTest', [createCounterConcept()], true);
  axium.subscribe((concepts) => {
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.badStages.length > 0) {
      const badStage = axiumState.badStages[0];
      const counter = selectState<Counter>(concepts, counterName);
      console.log('Stage Ran Away, badStages.length: ', axiumState.badStages.length, 'Count: ', counter.count);
      expect(badStage.stageFailed).toBe(2);
      expect(counter.count).toBe(2);
      setTimeout(() => {done();}, 500);
      staged.close();
    }
  });
  const staged = axium.stage('Stage DispatchOptions Test',
    [
      (concepts, dispatch) => {
        const counter = selectState<Counter>(concepts, counterName);
        console.log('Stage 1 ', counter, runCount);
        dispatch(counterAdd(), {
          iterateStep: true
        });
      }, (concepts, dispatch) => {
        runCount++;
        const counter = selectState<Counter>(concepts, counterName);
        console.log('Stage 2 ', counter, runCount);
        // Sets count to 2 and only runs once per state update
        dispatch(counterAdd(), {
          runOnce: true
        });
        // Will wait until count is set to 2, then set the Stage Explicitly to the third Step counting from 0.
        dispatch(counterAdd(), {
          setStep: 2,
          debounce: 0,
          on: {
            selector: counterSelectCount,
            expected: 2
          }
        });
        // }
      }, (concepts, dispatch) => {
        runCount++;
        const counter = selectState<Counter>(concepts, counterName);
        console.log('Stage 3 ', counter, runCount);
        // Will cause an action overflow forcing the stage to close and add itself to bad Stages
        dispatch(counterSubtract(), {
          // Enabling will cause this test to timeout via the subscription watching for badStages to never be ran.
          // debounce: 500
          // This demonstrates the fault resistance of the Stage paradigm, despite STRX's recursive functionality.
        });
      }
    ]);
});