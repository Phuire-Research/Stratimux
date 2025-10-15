/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will check in the next action
in the current strategy to the state's actionQue.
$>*/
/*<#*/
import { muxiumConcludeType } from '../../muxium/qualities/conclude.quality';
import { ExperimentState } from '../experiment.concept';
import { createQualityCard, Quality } from '../../../model/quality';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export type ExperimentCheckInStrategy = Quality<ExperimentState>;
export const experimentCheckInStrategy = createQualityCard<ExperimentState>({
  type: 'Experiment Check In Strategy',
  reducer: (state, action) => {
    if (action.strategy) {
      const nextAction = strategySuccess(action.strategy);
      if (nextAction.type !== muxiumConcludeType) {
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