/*<$
For the asynchronous graph programming framework Stratimux, generate a tests and demonstrates how debouncing methods perform their functionality.
$>*/
/*<#*/
import { muxiumSelectLastStrategy, muxiumSelectLastStrategyData } from '../concepts/muxium/muxium.selector';
import { muxiumKick } from '../concepts/muxium/qualities/kick.quality';
import { CounterDeck, CounterQualities, CounterState, counterName, createCounterConcept } from '../concepts/counter/counter.concept';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentDebounceAsyncIterateIdThenReceiveInMethod
} from '../concepts/experiment/qualities/debounceAsyncIterateIdThenReceiveInMethod.quality';
import { experimentAsyncDebounceNextActionNode } from '../concepts/experiment/qualities/debounceAsyncNextActionNode.quality';
import {
  ExperimentDebounceIterateIdThenReceiveInMethodPayload,
  experimentDebounceIterateIdThenReceiveInMethod
} from '../concepts/experiment/qualities/debounceIterateIdThenReceiveInMethod.quality';
import { experimentDebounceNextActionNode } from '../concepts/experiment/qualities/debounceNextActionNode.quality';
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
import { muxification } from '../model/muxium';
import { selectSlice, selectState } from '../model/selector';
import { createStage } from '../model/stagePlanner';
import { concept, Concept } from '../model/concept';

jest.setTimeout(30000);

test('Debounce method prevent excess count', (done) => {
  const qualities = {experimentDebounceNextActionNode};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(createExperimentState(), qualities) as Concept<typeof initialState, typeof qualities>;
  type DECK = {
    counter: Concept<CounterState, CounterQualities>,
    experiment: Concept<ExperimentState, typeof qualities>
  }
  const muxium = muxification('Experiment async method creator with State', {counter: createCounterConcept(), experiment});
  const plan = muxium.plan<DECK>('Experiment debounce add one', ({stage}) => [
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
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
  type DECK = {experiment: Concept<typeof initialState, typeof qualities>} & CounterDeck;
  const qualities = {experimentAsyncDebounceNextActionNode};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(initialState, qualities);
  const muxium = muxification('Experiment async debounce', { counter: createCounterConcept(), experiment});
  const plan = muxium.plan<DECK>('Experiment async debounce add one', ({stage}) => [
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
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
    const secondPlan = muxium.plan<DECK>('Second experiment async debounce add one', ({stage}) => [
      stage(({dispatch, d}) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy(d)), {
          iterateStage: true
        });
      }),
      stage(({dispatch, d}) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy(d)), {
          iterateStage: true
        });
      }),
      stage(({dispatch, d}) => {
        dispatch(strategyBegin(experimentAsyncDebounceAddOneStrategy(d)), {
          iterateStage: true
        });
      }),
      stage(({concepts}) => {
        const counterState = selectState<CounterState>(concepts, counterName);
        console.log('Async 2 Debounce HIT 4', counterState);
        if (counterState?.count === 2) {
          console.log('FINAL Async 2 Debounce HIT 4', counterState);
          expect(counterState.count).toBe(2);
          secondPlan.conclude();
          muxium.close();
          setTimeout(() => {
            done();
          }, 500);
        }
      })
    ]);
    // Muxium must be primed, therefore we kick it back into gear.
    // Downside of halting quality.
    muxium.dispatch(muxium.e.muxiumKick());
  }, 1000);
});

test('Debounce Method Test with State id comparison', (done) => {
  const qualities = {
    experimentDebounceIterateIdThenReceiveInMethod
  };
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(initialState, qualities);
  type DECK = {
    experiment: Concept<ExperimentState, typeof qualities>
  }
  const muxium = muxification('Experiment observe how concepts updates via reducer and method', {experiment});
  const plan = muxium.plan<DECK>('Debounce Iterate id with concepts', ({stage}) => [
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts}) => {
      const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
          concepts,
          muxiumSelectLastStrategyData
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
    const secondPlan = muxium.plan<DECK>('Second experiment debounce add one', ({stage}) => [
      stage(({concepts, dispatch, d}) => {
        console.log('2 Debounce initial dispatch');
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(d, experimentState.id)), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
          dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(d, experimentState.id)), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
          dispatch(strategyBegin(experimentDebounceIterateIdThenAddToData(d, experimentState.id)), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
            concepts,
            muxiumSelectLastStrategyData
          );
          console.log('2 Debounce: ', experimentState.id, lastStrategy, data);
          if (lastStrategy === experimentDebounceIterateIdThenAddToDataTopic) {
            if (data && data.id === 6) {
              console.log('2 Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
              expect(data.id).toBe(6);
              expect(data.setId).toBe(5);
              expect(experimentState.id).toBe(6);
              secondPlan.conclude();
              muxium.close();
              done();
            }
          }
        }
      })
    ]);
    // Kick
    muxium.dispatch(muxium.e.muxiumKick());
  }, 1000);
});

test('Debounce Async Method Test with State id comparison', (done) => {
  const qualities = {experimentDebounceAsyncIterateIdThenReceiveInMethod};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(initialState, qualities);
  type DECK = {
    experiment: Concept<typeof initialState, typeof qualities>;
  }
  const muxium = muxification('Experiment observe how concepts updates via reducer and method', {experiment});
  const plan = muxium.plan<DECK>('Debounce Async Iterate id with concepts', ({stage}) => [
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentDebounceAsyncIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceAsyncIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Async Debounce: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentDebounceAsyncIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
          concepts,
          muxiumSelectLastStrategyData
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
    const secondPlan = muxium.plan<DECK>('Second experiment async debounce add one', ({stage}) => [
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const strategy = experimentDebounceAsyncIterateIdThenAddToData(d, experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
          const strategy = experimentDebounceAsyncIterateIdThenAddToData(d, experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          console.log('2 Async Debounce: ', experimentState.id, lastStrategy, data);
          const strategy = experimentDebounceAsyncIterateIdThenAddToData(d, experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
            concepts,
            muxiumSelectLastStrategyData
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
              muxium.close();
              done();
            }
          }
        }
      })
    ]);
    // Kick
    muxium.dispatch(muxium.e.muxiumKick());
  }, 1000);
});
/*#>*/