/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a strategy that will set the Axium's mode to Ownership.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concepts } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { ownershipInitializeOwnership, ownershipInitializeOwnershipType } from '../qualities/initializeOwnership.quality';
import { axiumSetMode, axiumSetModeType } from '../../axium/qualities/setMode.quality';
import { ownershipName } from '../ownership.concept';
import { AxiumState } from '../../axium/axium.concept';
import { axiumSetDefaultModeIndex } from '../../axium/qualities/setDefaultModeIndex.quality';

export const ownershipSetOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
export function ownershipSetOwnershipModeStrategy(concepts: Concepts, modeName: string): ActionStrategy {
  const initializeOwnershipSemaphore = getSemaphore(concepts, ownershipName, ownershipInitializeOwnershipType);
  const setModeSemaphore = getSemaphore(concepts, ownershipName, axiumSetModeType);
  let ownershipModeIndex = 2;
  (concepts[0].state as AxiumState).modeNames.forEach((key, i) => {
    if (key === ownershipName) {
      ownershipModeIndex = i;
    }
  });

  const stepThree = createActionNode(ownershipInitializeOwnership(), {
    semaphore: initializeOwnershipSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Set',
    },
    failureNode: null,
  });
  const stepTwo = createActionNode(axiumSetDefaultModeIndex({
    index: ownershipModeIndex
  }), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null
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
    topic: ownershipSetOwnerShipModeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/