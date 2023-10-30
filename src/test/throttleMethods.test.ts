import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentThrottleAsyncIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/throttleAsyncIterateIdThenReceiveInMethod.quality';
import {
  ThrottleIterateIdThenReceiveInMethodPayload,
  experimentThrottleIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/throttleIterateIdThenReceiveInMethod.quality';

import {
  throttleAsyncIterateIdThenAddToData,
  throttleAsyncIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/throttleAsyncIterateIdThenAddToData.strategy';
import {
  throttleIterateIdThenAddToData,
  throttleIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/throttleIterateIdThenAddToData.strategy';

import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';

test('Action Throttle Method Test with Concepts id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentThrottleIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.stage('Throttle Iterate id with Concepts', [
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(throttleIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(throttleIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(throttleIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    },
    (concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ThrottleIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        if (lastStrategy === throttleIterateIdThenAddToDataTopic) {
          if (data) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(data.setId).toBe(0);
            expect(experimentState.id).toBe(3);
            plan.conclude();
            axium.close();
            done();
          }
        }
      }
    }
  ]);
});

jest.setTimeout(7000);
test('Action Throttle Async Method Test with Concepts id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentThrottleAsyncIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.stage('Action Throttle Async Iterate id with Concepts', [
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(throttleAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(throttleAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    },
    (concepts, dispatch) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(throttleAsyncIterateIdThenAddToData(experimentState.id)), {
          iterateStage: true
        });
      }
    },
    (concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ThrottleIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
        console.log('Last Async Action Throttle: ', experimentState.id, lastStrategy, data);
        if (lastStrategy === throttleAsyncIterateIdThenAddToDataTopic) {
          if (data) {
            console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(data.setId).toBe(0);
            expect(experimentState.id).toBe(3);
            plan.conclude();
          }
        }
      }
    }
  ]);
  setTimeout(() => {
    const secondPlan = axium.stage('Action Throttle Async Iterate id with Concepts', [
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const strategy = throttleAsyncIterateIdThenAddToData(experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
          const strategy = throttleAsyncIterateIdThenAddToData(experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
          const strategy = throttleAsyncIterateIdThenAddToData(experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      },
      (concepts, _) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
          const data = selectSlice<ExperimentState & ThrottleIterateIdThenReceiveInMethodPayload>(concepts, axiumSelectLastStrategyData);
          console.log('2 Last Async Action Throttle: ', experimentState.id, lastStrategy, data);
          if (lastStrategy === throttleAsyncIterateIdThenAddToDataTopic + 2) {
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
      }
    ]);
    axium.dispatch(axiumKick());
  }, 1000);
});