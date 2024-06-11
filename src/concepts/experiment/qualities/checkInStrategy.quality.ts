/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will check in the next action
in the current strategy to the state's actionQue.
$>*/
/*<#*/
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';
import { ExperimentState } from '../experiment.concept';
import { createQualityCard } from '../../../model/quality';

export const experimentCheckInStrategy = createQualityCard<ExperimentState>({
  type: 'Experiment check in Action',
  reducer: (state, action) => {
    if (action.strategy) {
      const nextAction = strategySuccess(action.strategy);
      if (nextAction.type !== axiumConcludeType) {
        return {
          actionQue: [... state.actionQue, nextAction]
        };
      }
    }
    return {
    };
  }
});
/*#>*/