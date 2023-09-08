import { Quality, Reducer, createQuality, defaultReducer, createDefaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const ownershipInitializeOwnershipType: ActionType = 'Ownership Initialize';

export function initializeOwnershipReducer(state: OwnershipState, action: Action) {
  return {
    ...state,
    initialized: true
  };
}
export const initializeOwnershipQuality = createQuality(
  ownershipInitializeOwnershipType,
  initializeOwnershipReducer,
  createDefaultMethodCreator
);
