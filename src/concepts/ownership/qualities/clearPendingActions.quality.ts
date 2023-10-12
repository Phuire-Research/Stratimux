import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const ownershipClearPendingActionsType: ActionType = 'clear Ownership\'s Pending Actions';
export const ownershipClearPendingActions = prepareActionCreator(ownershipClearPendingActionsType);

export function clearPendingActionsReducer(state: OwnershipState, _: Action): OwnershipState {
  return {
    ...state,
    pendingActions: []
  };
}
export const clearPendingActionsQuality = createQuality(
  ownershipClearPendingActionsType,
  clearPendingActionsReducer,
  defaultMethodCreator
);
