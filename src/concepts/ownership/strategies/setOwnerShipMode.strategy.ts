import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { SetModePayload, axiumSetModeType } from '../../axium/qualities/setMode.quality';
import { axiumSetBlockingModeType } from '../../axium/qualities/setBlockingMode.quality';

export const setOwnerShipModeKey = 'Set Axium Mode to Ownership';
export function setOwnershipModeStrategy(concepts: Concept[]): ActionStrategy {
  const initializeOwnershipSemaphore = getSemaphore(concepts, ownershipInitializeOwnershipType);
  const setModeSemaphore = getSemaphore(concepts, axiumSetModeType);

  const stepTwo: ActionNode = {
    actionType: ownershipInitializeOwnershipType,
    semaphore: initializeOwnershipSemaphore,
    successNode: null,
  };
  const stepOne: ActionNode = {
    actionType: axiumSetModeType,
    semaphore: setModeSemaphore,
    successNode: stepTwo,
    payload: { modeIndex: 2 } as SetModePayload
  };
  const params: ActionStrategyParameters = {
    key: setOwnerShipModeKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
