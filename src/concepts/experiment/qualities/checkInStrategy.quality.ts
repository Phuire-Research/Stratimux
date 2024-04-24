/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will check in the next action
in the current strategy to the state's actionQue.
$>*/
/*<#*/
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';
import { ExperimentState } from '../experiment.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  experimentCheckInStrategy,
  experimentCheckInStrategyType,
  experimentCheckInStrategyQuality
] = createQualitySet({
  type: 'Experiment check in Action',
  reducer: (state: ExperimentState, action) => {
    if (action.strategy) {
      const nextAction = strategySuccess(action.strategy);
      if (nextAction.type !== axiumConcludeType) {
        return {
          ...state,
          actionQue: [... state.actionQue, nextAction]
        };
      }
    }
    return {
      ...state
    };
  }
});
/*#>*/