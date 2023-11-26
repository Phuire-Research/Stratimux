/*<$
For the framework Stratimux and Axium Concept, generate a strategy that will safely remove concepts
from the Axium's concepts state property.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumRemoveConceptsViaQue, axiumRemoveConceptsViaQueType } from '../qualities/removeConceptsViaQue.quality';
import { axiumAppendConceptsToRemoveQue, axiumAppendConceptsToRemoveQueType } from '../qualities/appendConceptsToRemoveQue.quality';
import { axiumSetBlockingMode, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumOpen, axiumOpenType } from '../qualities/open.quality';
import { axiumSetDefaultMode, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

export const addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concepts, targetConcepts: Concept[]) {
  const setBlockingModeSemaphore = getSemaphore(concepts, axiumName, axiumSetBlockingModeType);
  const appendConceptsToRemoveQueSemaphore = getSemaphore(concepts, axiumName, axiumAppendConceptsToRemoveQueType);

  const stepTwo = createActionNode(axiumAppendConceptsToRemoveQue({concepts: targetConcepts}), {
    semaphore: appendConceptsToRemoveQueSemaphore,
    successNode: null,
    failureNode: null,
  });
  const stepOne = createActionNode(axiumSetBlockingMode({concepts}), {
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
export function removeConceptsViaQueThenUnblockStrategy(concepts: Concepts): ActionStrategy {
  const removeConceptsViaQueSemaphore = getSemaphore(concepts, axiumName, axiumRemoveConceptsViaQueType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(concepts, axiumName, axiumOpenType);

  const stepThree = createActionNode(axiumOpen({open: true}), {
    semaphore: openSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
    failureNode: null,
  });
  const stepTwo = createActionNode(axiumSetDefaultMode({concepts}), {
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
  });
  const stepOne = createActionNode(axiumRemoveConceptsViaQue(), {
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
/*#>*/