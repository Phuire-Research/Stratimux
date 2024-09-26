/*<$
For the asynchronous graph programming framework Stratimux,
generate a test to ensure that the strategy consumer function strategyRecurse is functioning as intended.
$>*/
/*<#*/
import { muxiumSelectLastStrategy, muxiumSelectLastStrategyData, muxiumSelectLastStrategyDialog } from '../concepts/muxium/muxium.selector';
import { muxiumKick } from '../concepts/muxium/qualities/kick.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import { experimentRecurseIterateId } from '../concepts/experiment/qualities/recurseIncrementId.quality';
import {
  experimentRecursivelyIterateId,
  experimentRecursivelyIterateIdTopic
} from '../concepts/experiment/strategies/recursivelyIterateId.strategy';
import { strategyBegin } from '../model/actionStrategy';
import { muxification } from '../model/muxium';
import { selectSlice, selectState } from '../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';

test('Asynchronous recursion', (done) => {
  const list = ['This', 'list', 'will', 'deplete', 'to', 'control', 'recursion', 'and', 'be', 'halting', 'complete'];
  const qualities = {experimentRecurseIterateId};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept<typeof initialState, typeof qualities>(createExperimentState(), qualities);
  const muxium = muxification('Experiment async method creator with Concepts', {experiment}, {storeDialog: true});
  const plan = muxium.plan('Experiment debounce add one', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentRecursivelyIterateId(d, [...list])), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastTopic = selectSlice(concepts, muxiumSelectLastStrategy);
        const lastData = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
        const lastDialog = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyDialog);
        console.log('Check Recursion: ', experimentState.id);
        if (lastTopic === experimentRecursivelyIterateIdTopic) {
          console.log('Final Recursion Check', experimentState.id, lastData, `\n${lastDialog}`);
          expect(experimentState.id).toBe(list.length);
          expect(lastData?.id).toBe(list.length - 1);
          plan.conclude();
          muxium.close();
          done();
        }
      }
    })
  ]);
});
/*$>*/