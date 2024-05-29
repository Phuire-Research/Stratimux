/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that throttle method helper functions are working as intended.
$>*/
/*<#*/
import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { axiumLog } from '../concepts/axium/qualities/log.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentThrottleAsyncIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/throttleAsyncIterateIdThenReceiveInMethod.quality';
import {
  ExperimentThrottleIterateIdThenReceiveInMethodPayload,
  experimentThrottleIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/throttleIterateIdThenReceiveInMethod.quality';

import {
  experimentThrottleAsyncIterateIdThenAddToData,
  experimentThrottleAsyncIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/throttleAsyncIterateIdThenAddToData.strategy';
import {
  experimentThrottleIterateIdThenAddToData,
  experimentThrottleIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/throttleIterateIdThenAddToData.strategy';

import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';

test('Action Throttle Method Test with Concepts id comparison', (done) => {
  const qualities = {experimentThrottleIterateIdThenReceiveInMethodQuality};
  const experiment = createExperimentConcept<typeof qualities>(createExperimentState(), qualities);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.plan('Throttle Iterate id with Concepts', () => [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentThrottleIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
          concepts,
          axiumSelectLastStrategyData
        );
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        console.log('What case', lastStrategy === experimentThrottleIterateIdThenAddToDataTopic);
        if (lastStrategy === experimentThrottleIterateIdThenAddToDataTopic) {
          console.log('Huh case');
          if (data) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            plan.conclude();
            expect(data.id).toBe(0);
            expect(data.setId).toBe(0);
            expect(experimentState.id).toBe(3);
            axium.close();
            done();
          }
        }
      }
    })
  ]);
});

jest.setTimeout(7000);
test('Action Throttle Async Method Test with Concepts id comparison', (done) => {
  const qualities = {experimentThrottleAsyncIterateIdThenReceiveInMethodQuality};
  const experiment = createExperimentConcept<typeof qualities>(createExperimentState(), qualities);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.plan('Action Throttle Async Iterate id with Concepts', () => [
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentThrottleAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
          concepts,
          axiumSelectLastStrategyData
        );
        console.log('Last Async Action Throttle: ', experimentState.id, lastStrategy, data, concepts);
        if (lastStrategy === experimentThrottleAsyncIterateIdThenAddToDataTopic) {
          if (data) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(data.setId).toBe(0);
            expect(experimentState.id).toBe(3);
            plan.conclude();
          }
        }
      }
    })
  ]);
  setTimeout(() => {
    const secondPlan = axium.plan('Action Throttle Async Iterate id with Concepts', () => [
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const strategy = experimentThrottleAsyncIterateIdThenAddToData(experimentState.id);
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
          console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
          const strategy = experimentThrottleAsyncIterateIdThenAddToData(experimentState.id);
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
          console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
          const strategy = experimentThrottleAsyncIterateIdThenAddToData(experimentState.id);
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
          const data = selectSlice<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
            concepts,
            axiumSelectLastStrategyData
          );
          console.log('2 Last Async Action Throttle: ', experimentState.id, lastStrategy, data, concepts);
          if (lastStrategy === experimentThrottleAsyncIterateIdThenAddToDataTopic + 2) {
            if (data) {
              console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
              expect(data.id).toBe(3);
              expect(data.setId).toBe(3);
              expect(experimentState.id).toBe(6);
              secondPlan.conclude();
              axium.close();
              done();
            }
          }
        }
      })
    ]);
    axium.dispatch(axiumKick());
  }, 1000);
});
/*#>*/