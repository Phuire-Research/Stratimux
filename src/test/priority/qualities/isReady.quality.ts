/*<$
For the asynchronous graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will set a ready property to true
$>*/
/*<#*/
import { quality } from '../../../model/quality';
import { ExperimentPriorityState } from '../priority.concept';

export const experimentPriorityIsReady = quality.create<ExperimentPriorityState>({
  type: 'experimentPriority is ready',
  reducer: (state) => ({
    ready: true
  }),
});
/*#>*/