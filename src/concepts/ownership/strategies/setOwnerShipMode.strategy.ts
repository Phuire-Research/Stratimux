import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { SetModePayload, axiumSetModeType } from '../../axium/qualities/setMode.quality';
import { axiumSetBlockingModeType } from '../../axium/qualities/setBlockingMode.quality';
import { ownershipKey } from '../ownership.concept';

export const setOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
export function setOwnershipModeStrategy(concepts: Concept[], modeName: string): ActionStrategy {
  const initializeOwnershipSemaphore = getSemaphore(concepts, ownershipKey, ownershipInitializeOwnershipType);
  const setModeSemaphore = getSemaphore(concepts, ownershipKey, axiumSetModeType);

  const stepTwo: ActionNode = {
    actionType: ownershipInitializeOwnershipType,
    semaphore: initializeOwnershipSemaphore,
    successNode: null,
    failureNode: null,
    preposition: 'Set',
    denoter: 'to True to enable Ownership Principle.'
  };
  const stepOne: ActionNode = {
    actionType: axiumSetModeType,
    semaphore: setModeSemaphore,
    successNode: stepTwo,
    failureNode: null,
    payload: { modeIndex: 2, modeName } as SetModePayload,
    preposition: 'Successfully'
  };
  const params: ActionStrategyParameters = {
    topic: setOwnerShipModeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
