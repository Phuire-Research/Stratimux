import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumRemoveConceptsViaQueType } from '../qualities/removeConceptsViaQue.quality';
import { AppendConceptsToRemoveQuePayload, axiumAppendConceptsToRemoveQueType } from '../qualities/appendConceptsToRemoveQue.quality';
import { SetBlockingModePayload, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { SetDefaultModePayload, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';

export const addConceptsToRemovalQueThenBlockKey = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
  const setBlockingModeSemaphore = getSemaphore(concepts, axiumSetBlockingModeType);
  const appendConceptsToRemoveQueSemaphore = getSemaphore(concepts, axiumAppendConceptsToRemoveQueType);
  const openSemaphore = getSemaphore(concepts, axiumOpenType);
  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    semaphore: openSemaphore,
    successNode: null,
  };
  const stepTwo: ActionNode = {
    actionType: axiumAppendConceptsToRemoveQueType,
    semaphore: appendConceptsToRemoveQueSemaphore,
    successNode: stepThree,
    payload: {concepts: targetConcepts} as AppendConceptsToRemoveQuePayload
  };
  const stepOne: ActionNode = {
    actionType: axiumSetBlockingModeType,
    semaphore: setBlockingModeSemaphore,
    successNode: stepTwo,
    payload: {concepts} as SetBlockingModePayload
  };
  const params: ActionStrategyParameters = {
    key: addConceptsToRemovalQueThenBlockKey,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const removeConceptsViaQueThenUnblockKey = 'Remove Concepts via Que then set Axium Mode to Default';
export function removeConceptsViaQueThenUnblockStrategy(concepts: Concept[]): ActionStrategy {
  const removeConceptsViaQueSemaphore = getSemaphore(concepts, axiumRemoveConceptsViaQueType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumSetDefaultModeType);

  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: null,
    payload: {concepts} as SetDefaultModePayload
  };
  const stepOne: ActionNode = {
    actionType: axiumRemoveConceptsViaQueType,
    semaphore: removeConceptsViaQueSemaphore,
    successNode: stepTwo,
  };

  const params: ActionStrategyParameters = {
    key: removeConceptsViaQueThenUnblockKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}