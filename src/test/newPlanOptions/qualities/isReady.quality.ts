/*<$
For the graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will set a ready property to true
$>*/
/*<#*/
import { Action, act } from '../../../model/action';
import { concept } from '../../../model/concept';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export const experimentPlanOptionsIsReadyType = 'experimentPlanOptions is ready';

export const experimentPlanOptionsIsReady = act.prepareActionCreator(experimentPlanOptionsIsReadyType);

function experimentPlanOptionsIsReadyReducer(state: ExperimentPlanOptionsState, action: Action): ExperimentPlanOptionsState {
  console.log('EXPERIMENT IS READY!!!');
  return {
    ...state,
    ready: true
  };
}

export const experimentPlanOptionsIsReadyQuality = concept.createQuality(
  experimentPlanOptionsIsReadyType,
  experimentPlanOptionsIsReadyReducer,
);
/*#>*/