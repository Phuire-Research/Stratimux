/*<$
For the graph programming framework Stratimux and Ownership Concept, generate a quality that will back track the provided strategy.
$>*/
/*<#*/
import { MethodCreator, createQuality, defaultReducer, nullReducer } from '../../../model/concept';
import { ActionType, prepareActionCreator } from '../../../model/action';
import { strategyBackTrack } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';

export const ownershipBackTrackType: ActionType = 'backtracking to previous ActionNode';
export const ownershipBackTrack = prepareActionCreator(ownershipBackTrackType);

const ownershipCreateBackTrackMethodCreator: MethodCreator = () => createMethod((action) => {
  if (action.strategy) {
    const newAction = strategyBackTrack(action.strategy);
    return newAction;
  } else {
    return action;
  }
});

export const backTrackQuality = createQuality(
  ownershipBackTrackType,
  nullReducer,
  ownershipCreateBackTrackMethodCreator,
);
/*#>*/