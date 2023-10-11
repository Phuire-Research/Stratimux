import { createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { PrincipleFunction } from '../model/principle';
import { Action, ActionType, prepareActionCreator } from '../model/action';
import { Subscriber } from 'rxjs';
import { Concept, createQuality } from '../model/concept';
import { UnifiedSubject } from '../model/unifiedSubject';
import { axiumSelectOpen } from '../concepts/axium/axium.selector';

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
  const experimentPrinciple: PrincipleFunction = (_: Subscriber<Action>, __: Concept[], concept$: UnifiedSubject) => {
    const stage = concept$.stage('Experiment Principle', [
      (___, dispatch) => {
        dispatch(experimentMockToTrue(), {
          iterateStep: true,
          on: {
            selector: axiumSelectOpen,
            expected: true
          },
          debounce: 0
        });
      },
      (concepts) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState.mock) {
          expect(experimentState.mock).toBe(true);
          setTimeout(() => done(), 1000);
          stage.close();
        }
      }
    ]);
  };
  createAxium('axiumStrategyTest', [
    createExperimentConcept(createExperimentState(), [experimentMockToTrueQuality], [experimentPrinciple])
  ], true, true);
});
