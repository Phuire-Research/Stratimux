import { defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';
import { ExperimentActionQueState } from '../experiment.concept';

export const experimentCheckInStrategyType = 'Experiment Check in Action';

export const experimentCheckInStrategy = prepareActionCreator(experimentCheckInStrategyType);

export function checkInStrategyReducer(state: ExperimentActionQueState, action: Action): ExperimentActionQueState {
  if (action.strategy) {
    // console.log('Check in reducer', action);
    const nextAction = strategySuccess(action.strategy);
    // console.log('Check in reducer2', nextAction.strategy?.lastActionNode.action, nextAction.strategy?.lastActionNode.action?.stubs);
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
  checkInStrategyReducer,
);
