/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that method helpers are working as intended.
$>*/
/*<#*/
import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentAsyncIterateIdThenReceiveInMethod,
  experimentAsyncIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/asyncIterateIdThenReceiveInMethod.quality';
import { experimentIterateIdThenReceiveInMethodQuality } from '../concepts/experiment/qualities/iterateIdThenReceiveInMethod.quality';
import { experimentMockToTrueQuality } from '../concepts/experiment/qualities/mockToTrue.quality';
import { experimentTimerEmitActionQuality } from '../concepts/experiment/qualities/timerEmitAction.quality';
import { experimentTimerEmitActionWithStateQuality } from '../concepts/experiment/qualities/timerEmitActionWithState.quality';
import {
  experimentAsyncIterateIdThenAddToData,
  experimentAsyncIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/asyncIterateIdThenAddToData.strategy';
import {
  iterateIdThenAddToData,
  experimentIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/iterateIdThenAddToData.strategy';
import { experimentTimedMockToTrue } from '../concepts/experiment/strategies/timedMockToTrue.strategy';
import {
  timedMockToTrueWithState,
  experimentTimedMockToTrueWithStateTopic
} from '../concepts/experiment/strategies/timedMockToTrueWithState.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';

test('Async Method Test', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentTimerEmitActionQuality, experimentMockToTrueQuality]);
  const axium = createAxium('Experiment async method creator', [experiment]);
  const plan = axium.plan('timed mock to true', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentTimedMockToTrue()), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState?.mock) {
        expect(experimentState.mock).toBe(true);
        plan.conclude();
        axium.close();
        done();
      }
    })
  ]);
});

test('Async Method Plain Iterate Id Test', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentAsyncIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment async method creator', [experiment]);
  const plan = axium.plan('timed mock to true', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(experimentAsyncIterateIdThenReceiveInMethod(), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      console.log(experiment.state);
      if (experimentState?.id) {
        expect(experimentState.id).toBe(1);
        setTimeout(() => {
          plan.conclude();
          axium.close();
        }, 50);
        done();
      }
    })
  ]);
});

test('Async Method with State Test', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentTimerEmitActionWithStateQuality, experimentMockToTrueQuality]);
  const axium = createAxium('Experiment async method creator with State', [experiment]);
  const plan = axium.plan('timed mock to true', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(timedMockToTrueWithState()), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        if (lastStrategy === experimentTimedMockToTrueWithStateTopic) {
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          if (data) {
            expect(data.mock).toBe(false);
            expect(experimentState.mock).toBe(true);
            plan.conclude();
            axium.close();
            done();
          }
        }
      }
    })
  ]);
});

test('Method Test with State id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.plan('Iterate id', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(iterateIdThenAddToData()), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
        console.log('CHECK LAST STRATEGY', lastStrategy);
        if (lastStrategy === experimentIterateIdThenAddToDataTopic) {
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          if (data) {
            console.log('Strategy Data: ', data.id, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(experimentState.id).toBe(1);
            plan.conclude();
            axium.close();
            done();
          }
        }
      }
    })
  ]);
});

test('Async Method Test with State id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentAsyncIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.plan('Iterate id', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentAsyncIterateIdThenAddToData()), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        if (lastStrategy === experimentAsyncIterateIdThenAddToDataTopic) {
          const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
          if (data) {
            console.log('Async Strategy Data: ', data.id, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(experimentState.id).toBe(1);
            plan.conclude();
            axium.close();
            done();
          }
        }
      }
    })
  ]);
});
/*#>*/