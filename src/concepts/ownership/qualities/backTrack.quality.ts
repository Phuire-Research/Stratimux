import { MethodCreator, createQuality, defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { ActionType, prepareActionCreator } from '../../../model/action';
import { strategyBackTrack } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';

export const ownershipBackTrackType: ActionType = 'backtracking to previous ActionNode';
export const ownershipBackTrack = prepareActionCreator(ownershipBackTrackType);

const createBackTrackMethodCreator: MethodCreator = () => createMethod((action) => {
  if (action.strategy) {
    const newAction = strategyBackTrack(action.strategy);
    return newAction;
  } else {
    return action;
  }
});

export const backTrackQuality = createQuality(
  ownershipBackTrackType,
  defaultReducer,
  createBackTrackMethodCreator,
);
