import { Counter, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { createExperimentConcept, createExperimentState } from '../concepts/experiment/experiment.concept';
import { asyncDebounceNextActionNodeQuality } from '../concepts/experiment/qualities/debounceAsyncNextActionNode.quality';
import { debounceNextActionNodeQuality } from '../concepts/experiment/qualities/debounceNextActionNode.quality';
import { experimentAsyncDebounceAddOneStrategy } from '../concepts/experiment/strategies/asyncDebounceAddOne.strategy';
import { experimentDebounceAddOneStrategy } from '../concepts/experiment/strategies/debounceAddOne.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';

jest.setTimeout(10000);
test('Debounce method prevent excess count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [debounceNextActionNodeQuality]);
  const axium = createAxium('Experiment async method creator with Concepts', [createCounterConcept(), experiment]);
  const plan = axium.stage('timed mock to true', [
    (_, dispatch) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy()), {
        iterateStage: true
      });
    },
    (_, dispatch) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy()), {
        iterateStage: true
      });
    },
    (_, dispatch) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const counterState = selectState<Counter>(concepts, counterName);
      console.log('Debounce HIT 4', counterState);
      if (counterState.count === 1) {
        console.log('Final Debounce HIT 4', counterState);
        expect(counterState.count).toBe(1);
        plan.conclude();
        done();
      }
    }
  ]);
});

test('Async debounce method prevent excess count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [asyncDebounceNextActionNodeQuality]);
  const axium = createAxium('Experiment async method creator with Concepts', [createCounterConcept(), experiment]);
  const plan = axium.stage('timed mock to true', [
    (_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
        iterateStage: true
      });
    },
    (_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
        iterateStage: true
      });
    },
    (_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const counterState = selectState<Counter>(concepts, counterName);
      console.log('Async Debounce HIT 4', counterState);
      if (counterState.count === 1) {
        console.log('Async Debounce HIT 4', counterState);
        expect(counterState.count).toBe(1);
        plan.conclude();
      }
    }
  ]);
  setTimeout(() => {
    const secondPlan = axium.stage('timed mock to true', [
      (_, dispatch) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
          iterateStage: true
        });
      },
      (_, dispatch) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
          iterateStage: true
        });
      },
      (_, dispatch) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
          iterateStage: true
        });
      },
      (concepts, _) => {
        const counterState = selectState<Counter>(concepts, counterName);
        console.log('Async Plan 2 Debounce HIT 4', counterState);
        if (counterState.count === 2) {
          console.log('Async Plan 2 Debounce HIT 4', counterState);
          expect(counterState.count).toBe(2);
          secondPlan.conclude();
          setTimeout(() => {
            done();
          }, 500);
        }
      }
    ]);
  }, 600);
});