/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the current pending actions list on state.
$>*/
/*<#*/
import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const ownershipClearPendingActionsType: ActionType = 'clear Ownership\'s Pending Actions';
export const ownershipClearPendingActions = prepareActionCreator(ownershipClearPendingActionsType);

function ownershipClearPendingActionsReducer(state: OwnershipState, _: Action): OwnershipState {
  return {
    ...state,
    pendingActions: []
  };
}
export const clearPendingActionsQuality = createQuality(
  ownershipClearPendingActionsType,
  ownershipClearPendingActionsReducer,
  defaultMethodCreator
);
/*#>*/