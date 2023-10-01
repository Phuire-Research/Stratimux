import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { SetModePayload, axiumSetModeType } from '../../axium/qualities/setMode.quality';
import { ownershipName } from '../ownership.concept';
import { SetDefaultModeIndexPayload, axiumSetDefaultModeIndexType } from '../../axium/qualities/setDefaultModeIndex.quality';
import { AxiumState } from '../../axium/axium.concept';

export const setOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
export function setOwnershipModeStrategy(concepts: Concept[], modeName: string): ActionStrategy {
  const initializeOwnershipSemaphore = getSemaphore(concepts, ownershipName, ownershipInitializeOwnershipType);
  const setModeSemaphore = getSemaphore(concepts, ownershipName, axiumSetModeType);
  const setDefaultModeIndexSemaphore = getSemaphore(concepts, ownershipName, axiumSetDefaultModeIndexType);
  let ownershipModeIndex = 2;
  (concepts[0].state as AxiumState).modeNames.forEach((key, i) => {
    if (key === ownershipName) {
      ownershipModeIndex = i;
    }
  });

  const stepTwo: ActionNode = {
    actionType: ownershipInitializeOwnershipType,
    semaphore: initializeOwnershipSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Set',
    },
    failureNode: null,
  };
  const stepOne: ActionNode = {
    actionType: axiumSetModeType,
    semaphore: setModeSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Successfully'
    },
    failureNode: null,
    payload: { modeIndex: 2, modeName } as SetModePayload,
  };
  const params: ActionStrategyParameters = {
    topic: setOwnerShipModeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
