/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will set a ready property to true
$>*/
/*<#*/
import { Action } from '../../../model/action';
import { quality } from '../../../model/quality';
import { ExperimentPlanOptionsState } from '../newPlanOptions.concept';

export const experimentPlanOptionsIsReady = quality.create<ExperimentPlanOptionsState>({
  type: 'experimentPlanOptions is ready',
  reducer: (state): ExperimentPlanOptionsState => ({
    ...state,
    ready: true
  }),
});
/*#>*/