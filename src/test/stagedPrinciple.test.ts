import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { PrincipleFunction } from '../model/principle';
import { Action, ActionType, prepareActionCreator } from '../model/action';
import { Subscriber } from 'rxjs';
import { Concepts, createQuality } from '../model/concept';
import { UnifiedSubject } from '../model/stagePlanner';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';
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
    const plan = concept$.stage('Experiment Principle', [
      (___, dispatch) => {
        dispatch(experimentMockToTrue(), {
          iterateStage: true,
          on: {
            selector: axiumSelectOpen,
            expected: true
          },
        });
      },
      (concepts, dispatch) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState?.mock) {
          expect(experimentState.mock).toBe(true);
          setTimeout(() => done(), 1000);
          dispatch(axiumPreClose({exit: false}), {
            iterateStage: true
          });
          plan.conclude();
        }
      },
      () => {
        //
      }
    ]);
  };
  createAxium('axiumStrategyTest', [
    createExperimentConcept(createExperimentState(), [experimentMockToTrueQuality], [experimentPrinciple])
  ], true, true);
});
