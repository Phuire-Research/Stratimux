/*<$
For the asynchronous graph programming framework Stratimux,
generate a test to ensure that the strategy consumer function strategyRecurse is functioning as intended.
$>*/
/*<#*/
import { axiumSelectLastStrategy, axiumSelectLastStrategyData, axiumSelectLastStrategyDialog } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import { experimentRecurseIterateIdQuality } from '../concepts/experiment/qualities/recurseIncrementId.quality';
import {
  experimentRecursivelyIterateId,
  experimentRecursivelyIterateIdTopic
} from '../concepts/experiment/strategies/recursivelyIterateId.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice, selectState } from '../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';

test('Asynchronous recursion', (done) => {
  const list = ['This', 'list', 'will', 'deplete', 'to', 'control', 'recursion', 'and', 'be', 'halting', 'complete'];
  const experiment = createExperimentConcept(createExperimentState(), [experimentRecurseIterateIdQuality]);
  const axium = createAxium('Experiment async method creator with Concepts', [experiment], false, true);
  const plan = axium.plan('Experiment debounce add one', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(strategyBegin(experimentRecursivelyIterateId([...list])), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastTopic = selectSlice(concepts, axiumSelectLastStrategy);
        const lastData = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        const lastDialog = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyDialog);
        console.log('Check Recursion: ', experimentState.id);
        if (lastTopic === experimentRecursivelyIterateIdTopic) {
          console.log('Final Recursion Check', experimentState.id, lastData, `\n${lastDialog}`);
          expect(experimentState.id).toBe(list.length);
          expect(lastData?.id).toBe(list.length - 1);
          plan.conclude();
          axium.close();
          done();
        }
      }
    })
  ]);
});
/*$>*/