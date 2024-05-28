/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will set a ready property to true
$>*/
/*<#*/
import { Action } from '../../../model/action';
import { quality } from '../../../model/quality';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

function experimentPlanOptionsIsReadyReducer(state: ExperimentPlanOptionsState, action: Action): ExperimentPlanOptionsState {
  return {
    ...state,
    ready: true
  };
}

export const [experimentPlanOptionsIsReady, experimentPlanOptionsIsReadyType, experimentPlanOptionsIsReadyQuality] = quality.createSet({
  type: 'experimentPlanOptions is ready',
  reducer: experimentPlanOptionsIsReadyReducer,
});
/*#>*/