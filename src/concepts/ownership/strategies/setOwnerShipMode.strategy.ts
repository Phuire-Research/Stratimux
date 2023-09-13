import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { SetModePayload, axiumSetModeType } from '../../axium/qualities/setMode.quality';
import { axiumSetBlockingModeType } from '../../axium/qualities/setBlockingMode.quality';
import { ownershipKey } from '../ownership.concept';
import { SetDefaultModeIndex, axiumSetDefaultModeIndexType } from '../../axium/qualities/setDefaultModeIndex.quality';
import { AxiumState } from '../../axium/axium.concept';

export const setOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
export function setOwnershipModeStrategy(concepts: Concept[], modeName: string): ActionStrategy {
  const initializeOwnershipSemaphore = getSemaphore(concepts, ownershipKey, ownershipInitializeOwnershipType);
  const setModeSemaphore = getSemaphore(concepts, ownershipKey, axiumSetModeType);
  const setDefaultModeIndexSemaphore = getSemaphore(concepts, ownershipKey, axiumSetDefaultModeIndexType);
  let ownershipModeIndex = 2;
  (concepts[0].state as AxiumState).modeKeys.forEach((key, i) => {
    if (key === ownershipKey) {
      ownershipModeIndex = i;
    }
  });

  const stepThree: ActionNode = {
    actionType: ownershipInitializeOwnershipType,
    semaphore: initializeOwnershipSemaphore,
    successNode: null,
    failureNode: null,
    preposition: 'Set',
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetModeType,
    semaphore: setModeSemaphore,
    successNode: stepThree,
    failureNode: null,
    payload: { modeIndex: 2, modeName } as SetModePayload,
    preposition: 'Successfully'
  };
  const stepOne: ActionNode = {
    actionType: axiumSetDefaultModeIndexType,
    semaphore: setDefaultModeIndexSemaphore,
    successNode: stepTwo,
    failureNode: null,
    payload: { index: ownershipModeIndex } as SetDefaultModeIndex,
    preposition: 'Successfully'
  };
  const params: ActionStrategyParameters = {
    topic: setOwnerShipModeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
