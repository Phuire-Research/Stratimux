import { Quality, Reducer, createQuality, defaultReducer, createDefaultMethodCreator } from '../../../model/concept';
import { Action, createAction } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';

export const initializeOwnership: Action = createAction('Ownership Initialize');

export function initializeOwnershipReducer(state: OwnershipState, action: Action) {
  console.log('HIT');
  return {
    ...state,
    initialized: true
  };
}
export const initializeOwnershipQuality = createQuality(
  initializeOwnership,
  initializeOwnershipReducer,
  createDefaultMethodCreator
);
