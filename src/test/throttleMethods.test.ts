/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that throttle method helper functions are working as intended.
$>*/
/*<#*/
import { muxiumSelectLastStrategy, muxiumSelectLastStrategyData } from '../concepts/muxium/muxium.selector';
import { muxiumKick } from '../concepts/muxium/qualities/kick.quality';
import { muxiumLog } from '../concepts/muxium/qualities/log.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentThrottleAsyncIterateIdThenReceiveInMethod
} from '../concepts/experiment/qualities/throttleAsyncIterateIdThenReceiveInMethod.quality';
import {
  ExperimentThrottleIterateIdThenReceiveInMethodPayload,
  experimentThrottleIterateIdThenReceiveInMethod
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
import { muxification } from '../model/muxium';
import { selectSlice, selectState } from '../model/selector';

test('Action Throttle Method Test with Concepts id comparison', (done) => {
  const qualities = {experimentThrottleIterateIdThenReceiveInMethod};
  const experiment = createExperimentConcept<ExperimentState, typeof qualities>(createExperimentState(), qualities);
  const muxium = muxification('Experiment observe how concepts updates via reducer and method', {experiment});
  const plan = muxium.plan('Throttle Iterate id with Concepts', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentThrottleIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
          concepts,
          muxiumSelectLastStrategyData
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
            muxium.close();
            done();
          }
        }
      }
    })
  ]);
});

jest.setTimeout(7000);
test('Action Throttle Async Method Test with Concepts id comparison', (done) => {
  const qualities = {experimentThrottleAsyncIterateIdThenReceiveInMethod};
  const experiment = createExperimentConcept<ExperimentState, typeof qualities>(createExperimentState(), qualities);
  const muxium = muxification('Experiment observe how concepts updates via reducer and method', {experiment});
  const plan = muxium.plan('Action Throttle Async Iterate id with Concepts', ({stage}) => [
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        dispatch(strategyBegin(experimentThrottleAsyncIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleAsyncIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, dispatch, d}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
        dispatch(strategyBegin(experimentThrottleAsyncIterateIdThenAddToData(d, experimentState.id)), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        const data = selectSlice<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
          concepts,
          muxiumSelectLastStrategyData
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
    const secondPlan = muxium.plan('Action Throttle Async Iterate id with Concepts', ({stage}) => [
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState) {
          const strategy = experimentThrottleAsyncIterateIdThenAddToData(d, experimentState.id);
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
          console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
          const strategy = experimentThrottleAsyncIterateIdThenAddToData(d, experimentState.id);
          strategy.topic += 2;
          dispatch(strategyBegin(strategy), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName); if (experimentState) {
          const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          console.log('Async Action Throttle: ', experimentState.id, lastStrategy, data);
          const strategy = experimentThrottleAsyncIterateIdThenAddToData(d, experimentState.id);
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
          const data = selectSlice<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
            concepts,
            muxiumSelectLastStrategyData
          );
          console.log('2 Last Async Action Throttle: ', experimentState.id, lastStrategy, data, concepts);
          if (lastStrategy === experimentThrottleAsyncIterateIdThenAddToDataTopic + 2) {
            if (data) {
              console.log('Strategy Data: ', data, 'Experiment State ID: ', experimentState.id);
              expect(data.id).toBe(3);
              expect(data.setId).toBe(3);
              expect(experimentState.id).toBe(6);
              secondPlan.conclude();
              muxium.close();
              done();
            }
          }
        }
      })
    ]);
    muxium.dispatch(muxium.e.muxiumKick());
  }, 1000);
});
/*#>*/