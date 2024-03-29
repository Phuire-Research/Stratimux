/*<$
For the graph programming framework Stratimux and based on the Experiment Concept, generate a quality that will set a ready property to true
$>*/
/*<#*/
import { Action, act } from '../../../model/action';
import { concept } from '../../../model/concept';
import { ExperimentPriorityState } from '../priority.concept';

export const experimentPriorityIsReadyType = 'experimentPriority is ready';

export const experimentPriorityIsReady = act.prepareActionCreator(experimentPriorityIsReadyType);

function experimentPriorityIsReadyReducer(state: ExperimentPriorityState, action: Action): ExperimentPriorityState {
  console.log('EXPERIMENT IS READY!!!');
  return {
    ...state,
    ready: true
  };
}

export const experimentPriorityIsReadyQuality = concept.createQuality(
  experimentPriorityIsReadyType,
  experimentPriorityIsReadyReducer,
);
/*#>*/