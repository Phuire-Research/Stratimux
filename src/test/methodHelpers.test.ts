import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  experimentAsyncIterateIdThenReceiveInMethodQuality
} from '../concepts/experiment/qualities/asyncIterateIdThenReceiveInMethod.quality copy';
import { experimentIterateIdThenReceiveInMethodQuality } from '../concepts/experiment/qualities/iterateIdThenReceiveInMethod.quality';
import { mockToTrueQuality } from '../concepts/experiment/qualities/mockTrue.quality';
import { timerEmitActionQuality } from '../concepts/experiment/qualities/timerEmitAction.quality';
import { timerEmitActionWithConceptsQuality } from '../concepts/experiment/qualities/timerEmitActionWithConcepts.quality';
import {
  asyncIterateIdThenAddToData,
  asyncIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/asyncIterateIdThenAddToData.strategy';
import { iterateIdThenAddToData, iterateIdThenAddToDataTopic } from '../concepts/experiment/strategies/iterateIdThenAddToData.strategy';
import { timedMockToTrue } from '../concepts/experiment/strategies/timedMockToTrue.strategy';
import {
  timedMockToTrueWithConcepts,
  timedMockToTrueWithConceptsTopic
} from '../concepts/experiment/strategies/timedMockToTrueWithConcepts.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';

test('Async Method Test', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [timerEmitActionQuality, mockToTrueQuality]);
  const axium = createAxium('Experiment async method creator', [experiment]);
  const plan = axium.stage('timed mock to true', [
    (_, dispatch) => {
      dispatch(strategyBegin(timedMockToTrue()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState.mock) {
        expect(experimentState.mock).toBe(true);
        plan.conclude();
        done();
      }
    }
  ]);
});

test('Async Method with Concepts Test', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [timerEmitActionWithConceptsQuality, mockToTrueQuality]);
  const axium = createAxium('Experiment async method creator with Concepts', [experiment]);
  const plan = axium.stage('timed mock to true', [
    (_, dispatch) => {
      dispatch(strategyBegin(timedMockToTrueWithConcepts()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (lastStrategy === timedMockToTrueWithConceptsTopic) {
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        if (data) {
          expect(data.mock).toBe(false);
          expect(experimentState.mock).toBe(true);
          plan.conclude();
          done();
        }
      }
    }
  ]);
});

test('Method Test with Concepts id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.stage('Iterate id', [
    (_, dispatch) => {
      dispatch(strategyBegin(iterateIdThenAddToData()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (lastStrategy === iterateIdThenAddToDataTopic) {
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        if (data) {
          console.log('Strategy Data: ', data.id, 'Experiment State ID: ', experimentState.id);
          expect(data.id).toBe(0);
          expect(experimentState.id).toBe(1);
          plan.conclude();
          done();
        }
      }
    }
  ]);
});

test('Async Method Test with Concepts id comparison', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentAsyncIterateIdThenReceiveInMethodQuality]);
  const axium = createAxium('Experiment observe how concepts updates via reducer and method', [experiment]);
  const plan = axium.stage('Iterate id', [
    (_, dispatch) => {
      dispatch(strategyBegin(asyncIterateIdThenAddToData()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      console.log('PING', experimentState);
      if (lastStrategy === asyncIterateIdThenAddToDataTopic) {
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        if (data) {
          console.log('Async Strategy Data: ', data.id, 'Experiment State ID: ', experimentState.id);
          expect(data.id).toBe(1);
          expect(experimentState.id).toBe(1);
          plan.conclude();
          done();
        }
      }
    }
  ]);
});