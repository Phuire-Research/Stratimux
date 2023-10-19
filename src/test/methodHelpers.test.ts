import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import { mockToTrueQuality } from '../concepts/experiment/qualities/mockTrue.quality';
import { timerEmitActionQuality } from '../concepts/experiment/qualities/timerEmitAction.quality';
import { timerEmitActionWithConceptsQuality } from '../concepts/experiment/qualities/timerEmitActionWithConcepts.quality';
import { timedMockToTrue } from '../concepts/experiment/strategies/timedMockToTrue.strategy';
import {
  timedMockToTrueWithConcepts,
  timedMockToTrueWithConceptsTopic
} from '../concepts/experiment/strategies/timedMockToTrueWithConcepts.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';

test('ActionController async Method Test', (done) => {
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

test('ActionController async Method Test with Concepts', (done) => {
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
