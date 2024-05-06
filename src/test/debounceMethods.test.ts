/*<$
For the asynchronous graph programming framework Stratimux, generate a tests and demonstrates how debouncing methods perform their functionality.
$>*/
/*<#*/
import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentDebounceAsyncIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/debounceAsyncIterateIdThenReceiveInMethod.quality';
import { experimentAsyncDebounceNextActionNodeQuality } from '../concepts/experiment/qualities/debounceAsyncNextActionNode.quality';
import {
  ExperimentDebounceIterateIdThenReceiveInMethodPayload,
  experimentDebounceIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/debounceIterateIdThenReceiveInMethod.quality';
import { experimentDebounceNextActionNodeQuality } from '../concepts/experiment/qualities/debounceNextActionNode.quality';
import { experimentAsyncDebounceAddOneStrategy } from '../concepts/experiment/strategies/asyncDebounceAddOne.strategy';
import { experimentDebounceAddOneStrategy } from '../concepts/experiment/strategies/debounceAddOne.strategy';
import {
  experimentDebounceAsyncIterateIdThenAddToData,
  experimentDebounceAsyncIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/debounceAsyncIterateIdThenAddToData.strategy';
import {
  experimentDebounceIterateIdThenAddToData,
  experimentDebounceIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/debounceIterateIdThenAddToData.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';
import { createStage } from '../model/stagePlanner';

jest.setTimeout(30000);

test('Debounce method prevent excess count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentDebounceNextActionNodeQuality]);
  const axium = createAxium('Experiment async method creator with State', [createCounterConcept(), experiment]);
  const plan = axium.plan('Experiment debounce add one', [
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy()), {
        iterateStage: true
      });
    }),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy()), {
        iterateStage: true
      });
    }),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy()), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      console.log('Debounce HIT 4', counterState);
      if (counterState?.count === 1) {
        console.log('Final Debounce HIT 4', counterState);
        expect(counterState.count).toBe(1);
        plan.conclude();
        done();
      }
    })
  ]);
});

test('Async debounce method prevent excess count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentAsyncDebounceNextActionNodeQuality]);
  const axium = createAxium('Experiment async debounce', [createCounterConcept(), experiment]);
  const plan = axium.plan('Experiment async debounce add one', [
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
        iterateStage: true
      });
    }),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
        iterateStage: true
      });
    }),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      console.log('Async Debounce HIT 4', counterState);
      if (counterState?.count === 1) {
        console.log('FINAL Async Debounce HIT 4', counterState);
        expect(counterState.count).toBe(1);
        plan.conclude();
      }
    })
  ]);
  setTimeout(() => {
    const secondPlan = axium.plan('Second experiment async debounce add one', [
      createStage((_, dispatch) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
          iterateStage: true
        });
      }),
      createStage((_, dispatch) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
          iterateStage: true
        });
      }),
      createStage((_, dispatch) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy()), {
          iterateStage: true
        });
      }),
      createStage((concepts, _) => {
        const counterState = selectState<CounterState>(concepts, counterName);
        console.log('Async 2 Debounce HIT 4', counterState);
        if (counterState?.count === 2) {
          console.log('FINAL Async 2 Debounce HIT 4', counterState);
          expect(counterState.count).toBe(2);
          secondPlan.conclude();
          axium.close();
          setTimeout(() => {
            done();
          }, 500);
        }
      })
    ]);
    // Axium must be primed, therefore we kick it back into gear.
    // Downside of halting quality.
    axium.dispatch(axiumKick());
  }, 1000);
});

test('Debounce Method Test with State id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentDebounceIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.plan('Debounce Iterate id with concepts', [
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
          concepts,
          axiumSelectLastStrategyData
        );
        console.log('Debounce: ', experimentState.id, lastStrategy, data);
        if (lastStrategy === experimentDebounceIterateIdThenAddToDataTopic) {
          if (data) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(3);
            expect(data.setId).toBe(2);
            expect(experimentState.id).toBe(3);
            plan.conclude();
          }
        }
      }
    })
  ]);
  setTimeout(() => {
    console.log('BEGIN 2ND PLAN');
    const secondPlan = axium.plan('Second experiment debounce add one', [
      createStage((concepts, dispatch) => {
        console.log('2 Debounce initial dispatch');
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(experimentState.id)), {
            iterateStage: true
          });
        }
      }),
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
          dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(experimentState.id)), {
            iterateStage: true
          });
        }
      }),
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
          dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(experimentState.id)), {
            iterateStage: true
          });
        }
      }),
      createStage((concepts, _) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
            concepts,
            axiumSelectLastStrategyData
          );
          console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
          if (lastStrategy === experimentDebounceIterateIdThenAddToDataTopic) {
            if (data && data.id === 6) {
              console.log('2 Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
              expect(data.id).toBe(6);
              expect(data.setId).toBe(5);
              expect(experimentState.id).toBe(6);
              secondPlan.conclude();
              axium.close();
              done();
            }
          }
        }
      })
    ]);
    // Kick
    axium.dispatch(axiumKick());
  }, 1000);
});

test('Debounce Async Method Test with State id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentDebounceAsyncIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.plan('Debounce Async Iterate id with concepts', [
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentDebounceAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
          concepts,
          axiumSelectLastStrategyData
        );
        console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
        if (lastStrategy === experimentDebounceAsyncIterateIdThenAddToDataTopic) {
          if (data) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(3);
            expect(data.setId).toBe(2);
            expect(experimentState.id).toBe(3);
            plan.conclude();
          }
        }
      }
    })
  ]);
  setTimeout(() => {
    console.log('BEGIN 2ND PLAN');
    const secondPlan = axium.plan('Second experiment async debounce add one', [
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const strategy = experimentDebounceAsyncIterateIdThenAddToData(experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
          const strategy = experimentDebounceAsyncIterateIdThenAddToData(experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
          const strategy = experimentDebounceAsyncIterateIdThenAddToData(experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      createStage((concepts, _) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
            concepts,
            axiumSelectLastStrategyData
          );
          console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
          console.log('2 Async Debounce: ', experimentDebounceAsyncIterateIdThenAddToDataTopic + 2);
          if (lastStrategy === experimentDebounceAsyncIterateIdThenAddToDataTopic + 2) {
            if (data) {
              console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
              expect(data.id).toBe(6);
              expect(data.setId).toBe(5);
              expect(experimentState.id).toBe(6);
              secondPlan.conclude();
              axium.close();
              done();
            }
          }
        }
      })
    ]);
    // Kick
    axium.dispatch(axiumKick());
  }, 1000);
});
/*#>*/