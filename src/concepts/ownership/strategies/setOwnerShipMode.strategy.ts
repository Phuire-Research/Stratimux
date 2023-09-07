import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, primeAction } from '../../../model/action';
import { ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { SetModePayload, axiumSetModeType } from '../../axium/qualities/setMode.quality';

export const setOwnerShipModeKey = 'Set Axium Mode to Ownership';
export function setOwnershipModeStrategy(concepts: Concept[]): ActionStrategy {
  const primedInitializeOwnership = primeAction(concepts, createAction(ownershipInitializeOwnershipType));
  const primedSetMode = primeAction(concepts, createAction(axiumSetModeType));

  const stepTwo: ActionNode = {
    action: primedInitializeOwnership,
    successNode: null,
  };
  const stepOne: ActionNode = {
    action: primedSetMode,
    successNode: stepTwo,
    payload: { modeIndex: 2 } as SetModePayload
  };
  const params: ActionStrategyParameters = {
    key: setOwnerShipModeKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
