/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will check in the next action
in the current strategy to the state's actionQue.
$>*/
/*<#*/
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';
import { ExperimentState } from '../experiment.concept';

export const experimentCheckInStrategyType = 'Experiment Check in Action';

export const experimentCheckInStrategy = prepareActionCreator(experimentCheckInStrategyType);

function experimentCheckInStrategyReducer(state: ExperimentState, action: Action): ExperimentState {
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

export const checkInStrategyQuality = createQuality(
  experimentCheckInStrategyType,
  experimentCheckInStrategyReducer,
);
/*#>*/