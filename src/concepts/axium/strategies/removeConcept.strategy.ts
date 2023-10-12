import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumRemoveConceptsViaQue, axiumRemoveConceptsViaQueType } from '../qualities/removeConceptsViaQue.quality';
import { axiumAppendConceptsToRemoveQue, axiumAppendConceptsToRemoveQueType } from '../qualities/appendConceptsToRemoveQue.quality';
import { axiumSetBlockingMode, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumOpen, axiumOpenType } from '../qualities/open.quality';
import { axiumSetDefaultMode, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

export const addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
  const setBlockingModeSemaphore = getSemaphore(concepts, axiumName, axiumSetBlockingModeType);
  const appendConceptsToRemoveQueSemaphore = getSemaphore(concepts, axiumName, axiumAppendConceptsToRemoveQueType);

  const stepTwo: ActionNode = createActionNode(axiumAppendConceptsToRemoveQue({concepts: targetConcepts}), {
    semaphore: appendConceptsToRemoveQueSemaphore,
    successNode: null,
    failureNode: null,
  });
  const stepOne: ActionNode = createActionNode(axiumSetBlockingMode({concepts}), {
    semaphore: setBlockingModeSemaphore,
    successNode: stepTwo,
    failureNode: null,
  });
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

  const stepThree: ActionNode = createActionNode(axiumOpen(true), {
    semaphore: openSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
    failureNode: null,
  });
  const stepTwo: ActionNode = createActionNode(axiumSetDefaultMode({concepts}), {
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
  });
  const stepOne: ActionNode = createActionNode(axiumRemoveConceptsViaQue(), {
    semaphore: removeConceptsViaQueSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'To Begin'
    },
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: removeConceptsViaQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}