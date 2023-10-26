import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { ownershipInitializeOwnership, ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { axiumSetMode, axiumSetModeType } from '../../axium/qualities/setMode.quality';
import { ownershipName } from '../ownership.concept';
import { AxiumState } from '../../axium/axium.concept';

export const setOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
export function setOwnershipModeStrategy(concepts: Concepts, modeName: string): ActionStrategy {
  const initializeOwnershipSemaphore = getSemaphore(concepts, ownershipName, ownershipInitializeOwnershipType);
  const setModeSemaphore = getSemaphore(concepts, ownershipName, axiumSetModeType);
  let ownershipModeIndex = 2;
  (concepts[0].state as AxiumState).modeNames.forEach((key, i) => {
    if (key === ownershipName) {
      ownershipModeIndex = i;
    }
  });

  const stepTwo = createActionNode(ownershipInitializeOwnership(), {
    semaphore: initializeOwnershipSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Set',
    },
    failureNode: null,
  });
  const stepOne = createActionNode(axiumSetMode({ modeIndex: ownershipModeIndex, modeName }), {
    semaphore: setModeSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Successfully'
    },
    failureNode: null,
  });
  const params: ActionStrategyParameters = {
    topic: setOwnerShipModeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
