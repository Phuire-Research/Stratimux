/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that you can create a stage planner within a concept's principle.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { selectState } from '../model/selectors/selector';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { PrincipleFunction } from '../model/principle';
import { Action } from '../model/action/action.type';
import { createQualityCard } from '../model/quality';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';

type ExperimentState = {
  mock: boolean;
};

const createExperimentState = (): ExperimentState => ({ mock: false });

function experimentMockToTrueReducer(state: ExperimentState, action: Action): ExperimentState {
  return {
    mock: true
  };
}
const experimentMockToTrue = createQualityCard({type: 'Experiment set mock to True', reducer: experimentMockToTrueReducer});

test('Muxium Principle Stage', (done) => {
  const qualities = {experimentMockToTrue};
  const experimentPrinciple: PrincipleFunction<typeof qualities, MuxiumDeck> = ({plan}) => {
    const planExperiment = plan('Experiment Principle', ({stage, stageO, conclude, e__}) => [
      stageO(() => e__.experimentMockToTrue()),
      stage(({concepts, dispatch, d}) => {
        const experimentState = selectState<ExperimentState>(concepts, experimentName);
        if (experimentState?.mock) {
          expect(experimentState.mock).toBe(true);
          setTimeout(() => done(), 1000);
          dispatch(d.muxium.e.muxiumPreClose({exit: false}), {
            iterateStage: true
          });
          planExperiment.conclude();
        }
      }),
      conclude()
    ]);
  };
  muxification('muxiumStrategyTest', {
    experiment: createExperimentConcept<ExperimentState, MuxiumDeck>(createExperimentState(), qualities, [experimentPrinciple])
  }, {logging: true, storeDialog: true});
});
/*#>*/