import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { Counter, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import { experimentDebounceAsyncIterateIdThenReceiveInMethodQuality } from '../concepts/experiment/qualities/debounceAsyncIterateIdThenReceiveInMethod.quality';
import { asyncDebounceNextActionNodeQuality } from '../concepts/experiment/qualities/debounceAsyncNextActionNode.quality';
import { DebounceIterateIdThenReceiveInMethodPayload, experimentDebounceIterateIdThenReceiveInMethodQuality } from '../concepts/experiment/qualities/debounceIterateIdThenReceiveInMethod.quality';
import { debounceNextActionNodeQuality } from '../concepts/experiment/qualities/debounceNextActionNode.quality';
import { experimentAsyncDebounceAddOneStrategy } from '../concepts/experiment/strategies/asyncDebounceAddOne.strategy';
import { experimentDebounceAddOneStrategy } from '../concepts/experiment/strategies/debounceAddOne.strategy';
import { debounceAsyncIterateIdThenAddToData, debounceAsyncIterateIdThenAddToDataTopic } from '../concepts/experiment/strategies/debounceAsyncIterateIdThenAddToData.strategy';
import { debounceIterateIdThenAddToData, debounceIterateIdThenAddToDataTopic } from '../concepts/experiment/strategies/debounceIterateIdThenAddToData.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';

test('Debounce method prevent excess count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [debounceNextActionNodeQuality]);
  const axium = createAxium('Experiment async method creator with Concepts', [createCounterConcept(), experiment]);
  const plan = axium.stage('Experiment debounce add one', [
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
  const axium = createAxium('Experiment async debounce', [createCounterConcept(), experiment]);
  const plan = axium.stage('Experiment async debounce add one', [
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
        console.log('FINAL Async Debounce HIT 4', counterState);
        expect(counterState.count).toBe(1);
        plan.conclude();
      }
    }
  ]);
  setTimeout(() => {
    const secondPlan = axium.stage('Second experiment async debounce add one', [
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
        console.log('Async 2 Debounce HIT 4', counterState);
        if (counterState.count === 2) {
          console.log('FINAL Async 2 Debounce HIT 4', counterState);
          expect(counterState.count).toBe(2);
          secondPlan.conclude();
          setTimeout(() => {
            done();
          }, 500);
        }
      }
    ]);
    // Axium must be primed, therefore we kick it back into gear.
    // Downside of halting quality.
    axium.dispatch(axiumKick());
  }, 1000);
});

test('Debounce Method Test with Concepts id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentDebounceIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.stage('Debounce Iterate id with concepts', [
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      dispatch(strategyBegin(debounceIterateIdThenAddToData(experimentState.id)), {
        iterateStage: true
      });
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
      console.log('Debounce: ', experimentState.id, lastStrategy, data);
      dispatch(strategyBegin(debounceIterateIdThenAddToData(experimentState.id)), {
        iterateStage: true
      });
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
      console.log('Debounce: ', experimentState.id, lastStrategy, data);
      dispatch(strategyBegin(debounceIterateIdThenAddToData(experimentState.id)), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      const data = selectSlice<ExperimentState & DebounceIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
      console.log('Debounce: ', experimentState.id, lastStrategy, data);
      if (lastStrategy === debounceIterateIdThenAddToDataTopic) {
        if (data) {
          console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
          expect(data.id).toBe(3);
          expect(data.setId).toBe(2);
          expect(experimentState.id).toBe(3);
          plan.conclude();
        }
      }
    }
  ]);
  setTimeout(() => {
    console.log('BEGIN 2ND PLAN');
    const secondPlan = axium.stage('Second experiment debounce add one', [
      (concepts, dispatch) => {
        console.log('2 Debounce initial dispatch');
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        dispatch(strategyBegin(debounceIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(debounceIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(debounceIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      },
      (concepts, _) => {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const data = selectSlice<ExperimentState & DebounceIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
        console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
        if (lastStrategy === debounceIterateIdThenAddToDataTopic) {
          if (data && data.id === 6) {
            console.log('2 Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(6);
            expect(data.setId).toBe(5);
            expect(experimentState.id).toBe(6);
            secondPlan.conclude();
            done();
          }
        }
      }
    ]);
    // Kick
    axium.dispatch(axiumKick());
  }, 1000);
});

test('Debounce Async Method Test with Concepts id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentDebounceAsyncIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.stage('Debounce Async Iterate id with concepts', [
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      dispatch(strategyBegin(debounceAsyncIterateIdThenAddToData(experimentState.id)), {
        iterateStage: true
      });
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
      console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
      dispatch(strategyBegin(debounceAsyncIterateIdThenAddToData(experimentState.id)), {
        iterateStage: true
      });
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
      console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
      dispatch(strategyBegin(debounceAsyncIterateIdThenAddToData(experimentState.id)), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      const data = selectSlice<ExperimentState & DebounceIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
      console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
      if (lastStrategy === debounceAsyncIterateIdThenAddToDataTopic) {
        if (data) {
          console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
          expect(data.id).toBe(3);
          expect(data.setId).toBe(2);
          expect(experimentState.id).toBe(3);
          plan.conclude();
        }
      }
    }
  ]);
  setTimeout(() => {
    console.log('BEGIN 2ND PLAN');
    const secondPlan = axium.stage('Second experiment async debounce add one', [
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        dispatch(strategyBegin(debounceAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(debounceAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(debounceAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      },
      (concepts, _) => {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        const data = selectSlice<ExperimentState & DebounceIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
        console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
        if (lastStrategy === debounceAsyncIterateIdThenAddToDataTopic) {
          if (data && data.id === 6) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(6);
            expect(data.setId).toBe(5);
            expect(experimentState.id).toBe(6);
            secondPlan.conclude();
            done();
          }
        }
      }
    ]);
    // Kick
    axium.dispatch(axiumKick());
  }, 1000);
});