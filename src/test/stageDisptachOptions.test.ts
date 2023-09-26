import { createAxium } from '../model/axium';
import { Concept } from '../model/concept';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { Counter, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { counterAdd } from '../concepts/counter/qualities/add.quality';
import { counterSubtract } from '../concepts/counter/qualities/subtract.quality';

test('Axium Stage Dispatch Options Test', (done) => {
  let runCount = 0;
  const axium = createAxium([createCounterConcept()], true);
  axium.subscribe((concepts) => {
    const axiumState = concepts[0].state as AxiumState;
    if (axiumState.badStages.length > 0) {
      const badStage = axiumState.badStages[0];
      const counter = selectState<Counter>(concepts, counterName);
      console.log('Stage Ran Away, badStages.length: ', axiumState.badStages.length, 'Count: ', counter.count);
      expect(badStage.step).toBe(2);
      expect(counter.count).toBe(2);
      setTimeout(() => {done();}, 500);
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
        dispatch(counterAdd(), {
          runOnce: true
        });
        if (counter.count === 2) {
          console.log('Counter should be 2', counter.count);
          expect(counter.count).toBe(2);
          dispatch(counterAdd(), {
            setStep: 2,
            debounce: 0
          });
        }
      }, (concepts, dispatch) => {
        runCount++;
        const counter = selectState<Counter>(concepts, counterName);
        console.log('Stage 3 ', counter, runCount);
        // Will cause the stage to close
        dispatch(counterSubtract(), {
          // Enabling will prevent close and cause this test to timeout
          // debounce: 500
        });
      }
    ]);
});