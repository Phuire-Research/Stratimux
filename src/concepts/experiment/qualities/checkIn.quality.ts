import { defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';

export const experimentCheckInType = 'Experiment Check in Action';

export const experimentCheckIn = prepareActionCreator(experimentCheckInType);

export function checkInReducer(state: ExperimentState, action: Action): ExperimentState {
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

export const checkInQuality = createQuality(
  experimentCheckInType,
  checkInReducer,
);
