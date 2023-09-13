import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumRemoveConceptsViaQueType } from '../qualities/removeConceptsViaQue.quality';
import { AppendConceptsToRemoveQuePayload, axiumAppendConceptsToRemoveQueType } from '../qualities/appendConceptsToRemoveQue.quality';
import { SetBlockingModePayload, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { SetDefaultModePayload, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumKey } from '../axium.concept';

export const addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
  const setBlockingModeSemaphore = getSemaphore(concepts, axiumKey, axiumSetBlockingModeType);
  const appendConceptsToRemoveQueSemaphore = getSemaphore(concepts, axiumKey, axiumAppendConceptsToRemoveQueType);
  const openSemaphore = getSemaphore(concepts, axiumKey, axiumOpenType);
  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    semaphore: openSemaphore,
    successNode: null,
    failureNode: null,
  };
  const stepTwo: ActionNode = {
    actionType: axiumAppendConceptsToRemoveQueType,
    semaphore: appendConceptsToRemoveQueSemaphore,
    successNode: stepThree,
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
  const removeConceptsViaQueSemaphore = getSemaphore(concepts, axiumKey, axiumRemoveConceptsViaQueType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumKey, axiumSetDefaultModeType);

  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: null,
    failureNode: null,
    payload: {concepts} as SetDefaultModePayload
  };
  const stepOne: ActionNode = {
    actionType: axiumRemoveConceptsViaQueType,
    semaphore: removeConceptsViaQueSemaphore,
    successNode: stepTwo,
    failureNode: null,
  };

  const params: ActionStrategyParameters = {
    topic: removeConceptsViaQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}