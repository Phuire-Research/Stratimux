/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that you can create a stage planner within a concept's principle.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { PrincipleFunction } from '../model/principle';
import { Action } from '../model/action';
import { Subscriber } from 'rxjs';
import { Concepts } from '../model/concept';
import { UnifiedSubject, createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';
import { createQualitySet } from '../model/quality';

type ExperimentState = {
  mock: boolean;
};

const createExperimentState = (): ExperimentState => ({ mock: false });

function experimentMockToTrueReducer(state: ExperimentState, action: Action): ExperimentState {
  return {
    ...state,
    mock: true
  };
}
const [
  experimentMockToTrue,
  experimentMockToTrueType,
  experimentMockToTrueQuality
] = createQualitySet({type: 'Experiment set mock to True', reducer: experimentMockToTrueReducer});

test('Axium Principle Stage', (done) => {
  const qualities = {experimentMockToTrueQuality};
  const experimentPrinciple: PrincipleFunction<typeof qualities> = ({plan}) => {
    const planExperiment = plan('Experiment Principle', ({stage, stageO}) => [
      stageO(() => experimentMockToTrue()),
      stage(({concepts, dispatch}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState?.mock) {
          expect(experimentState.mock).toBe(true);
          setTimeout(() => done(), 1000);
          dispatch(axiumPreClose({exit: false}), {
            iterateStage: true
          });
          planExperiment.conclude();
        }
      }),
      stage(() => {
        //
      })
    ]);
  };
  createAxium('axiumStrategyTest', [
    createExperimentConcept<typeof qualities>(createExperimentState(), qualities, [experimentPrinciple])
  ], {logging: true, storeDialog: true});
});
/*#>*/