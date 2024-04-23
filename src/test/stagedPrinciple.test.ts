/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that you can create a stage planner within a concept's principle.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { PrincipleFunction } from '../model/principle';
import { Action, ActionType, prepareActionCreator } from '../model/action';
import { Subscriber } from 'rxjs';
import { Concepts, createQuality } from '../model/concept';
import { UnifiedSubject, createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';

type ExperimentState = {
  mock: boolean;
};

const createExperimentState = (): ExperimentState => ({ mock: false });

const experimentMockToTrueType: ActionType = 'Experiment set mock to True';
const experimentMockToTrue = prepareActionCreator(experimentMockToTrueType);
function experimentMockToTrueReducer(state: ExperimentState, action: Action): ExperimentState {
  return {
    ...state,
    mock: true
  };
}
const experimentMockToTrueQuality = createQuality(experimentMockToTrueType, experimentMockToTrueReducer);

test('Axium Principle Stage', (done) => {
  const experimentPrinciple: PrincipleFunction = (_: Subscriber<Action>, __: Concepts, concept$: UnifiedSubject) => {
    const plan = concept$.plan('Experiment Principle', [
      stageWaitForOpenThenIterate(() => experimentMockToTrue()),
      createStage((concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState?.mock) {
          expect(experimentState.mock).toBe(true);
          setTimeout(() => done(), 1000);
          dispatch(axiumPreClose({exit: false}), {
            iterateStage: true
          });
          plan.conclude();
        }
      }),
      createStage(() => {
        //
      })
    ]);
  };
  createAxium('axiumStrategyTest', [
    createExperimentConcept(createExperimentState(), [experimentMockToTrueQuality], [experimentPrinciple])
  ], true, true);
});
/*#>*/