import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumRemoveConceptsViaQueType } from '../qualities/removeConceptsViaQue.quality';
import { AppendConceptsToRemoveQuePayload, axiumAppendConceptsToRemoveQueType } from '../qualities/appendConceptsToRemoveQue.quality';
import { SetBlockingModePayload, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { SetDefaultModePayload, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

export const addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
  const setBlockingModeSemaphore = getSemaphore(concepts, axiumName, axiumSetBlockingModeType);
  const appendConceptsToRemoveQueSemaphore = getSemaphore(concepts, axiumName, axiumAppendConceptsToRemoveQueType);

  const stepTwo: ActionNode = {
    actionType: axiumAppendConceptsToRemoveQueType,
    semaphore: appendConceptsToRemoveQueSemaphore,
    successNode: null,
    failureNode: null,
    payload: {concepts: targetConcepts} as AppendConceptsToRemoveQuePayload
  };
  const stepOne: ActionNode = {
    actionType: axiumSetBlockingModeType,
    semaphore: setBlockingModeSemaphore,
    successNode: stepTwo,
    failureNode: null,
    payload: {concepts} as SetBlockingModePayload
  };
  const params: ActionStrategyParameters = {
    topic: addConceptsToRemovalQueThenBlockTopic,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const removeConceptsViaQueThenUnblockTopic = 'Remove Concepts via Que then set Axium Mode to Default';
export function removeConceptsViaQueThenUnblockStrategy(concepts: Concept[]): ActionStrategy {
  const removeConceptsViaQueSemaphore = getSemaphore(concepts, axiumName, axiumRemoveConceptsViaQueType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(concepts, axiumName, axiumOpenType);

  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    semaphore: openSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
    failureNode: null,
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
    payload: {concepts} as SetDefaultModePayload,
  };
  const stepOne: ActionNode = {
    actionType: axiumRemoveConceptsViaQueType,
    semaphore: removeConceptsViaQueSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'To Begin'
    },
    failureNode: null,
  };

  const params: ActionStrategyParameters = {
    topic: removeConceptsViaQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}