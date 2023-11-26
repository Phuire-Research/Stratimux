import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const ownershipInitializeOwnershipType: ActionType = 'Ownership Initialize to True to enable Ownership Principle';
export const ownershipInitializeOwnership = prepareActionCreator(ownershipInitializeOwnershipType);

export function ownershipInitializeOwnershipReducer(state: OwnershipState, _: Action) {
  return {
    ...state,
    initialized: true
  };
}
export const initializeOwnershipQuality = createQuality(
  ownershipInitializeOwnershipType,
  ownershipInitializeOwnershipReducer,
  defaultMethodCreator
);
