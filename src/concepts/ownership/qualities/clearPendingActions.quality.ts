import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const ownershipClearPendingActionsType: ActionType = 'clear Ownership\'s Pending Actions';

export function clearPendingActionsReducer(state: OwnershipState, action: Action): OwnershipState {
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
