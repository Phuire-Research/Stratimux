import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const ownershipInitializeOwnershipType: ActionType = 'Ownership Initialize to True to enable Ownership Principle';

export function initializeOwnershipReducer(state: OwnershipState, _: Action) {
  return {
    ...state,
    initialized: true
  };
}
export const initializeOwnershipQuality = createQuality(
  ownershipInitializeOwnershipType,
  initializeOwnershipReducer,
  defaultMethodCreator
);
