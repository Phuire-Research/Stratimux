/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that you can create a stage planner within a concept's principle.
$>*/
/*<#*/
import { AxiumDeck, createAxium } from '../model/axium';
import { selectState } from '../model/selector';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { PrincipleFunction } from '../model/principle';
import { Action } from '../model/action';
import { axiumPreClose } from '../concepts/axium/qualities/preClose.quality';
import { createQualityCard } from '../model/quality';
import { AxiumQualities } from '../concepts/axium/qualities';

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
const experimentMockToTrue = createQualityCard({type: 'Experiment set mock to True', reducer: experimentMockToTrueReducer});

test('Axium Principle Stage', (done) => {
  const qualities = {experimentMockToTrue};
  const experimentPrinciple: PrincipleFunction<typeof qualities, AxiumDeck> = ({plan}) => {
    const planExperiment = plan('Experiment Principle', ({stage, stageO, conclude, e__}) => [
      stageO(() => e__.experimentMockToTrue()),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState?.mock) {
          expect(experimentState.mock).toBe(true);
          setTimeout(() => done(), 1000);
          dispatch(d.axium.e.axiumPreClose({exit: false}), {
            iterateStage: true
          });
          planExperiment.conclude();
        }
      }),
      conclude()
    ]);
  };
  createAxium('axiumStrategyTest', {
    experiment: createExperimentConcept<typeof qualities>(createExperimentState(), qualities, [experimentPrinciple])
  }, {logging: true, storeDialog: true});
});
/*#>*/