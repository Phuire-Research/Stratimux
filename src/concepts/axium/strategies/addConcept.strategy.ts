/*<$
For the graph programming framework Stratimux and Axium Concept,
generate an ActionStrategy that will add new concepts into the Axium's conceptual set.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts } from '../../../model/concept';
import { getSemaphore} from '../../../model/action';
import { axiumAddConceptFromQue, axiumAddConceptFromQueType } from '../qualities/addConceptsFromQue.quality';
import { axiumAppendConceptsToAddQue, axiumAppendConceptsToAddQueType } from '../qualities/appendConceptsToAddQue.quality';
import { axiumOpen, axiumOpenType } from '../qualities/open.quality';
import { axiumSetBlockingMode, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumSetDefaultMode, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

// Step One to Add Concepts to Axium
export const addConceptsToAddQueThenBlockTopic = 'Add Concepts to add que then set Axium Mode to Blocking';
export function addConceptsToAddQueThenBlockStrategy(concepts: Concepts, newConcepts: Concept[]) {
  const stepTwo = createActionNode(axiumAppendConceptsToAddQue({concepts: newConcepts}),{
    successNode: null,
    successNotes: {
      preposition: 'Then Safely'
    },
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumName, axiumAppendConceptsToAddQueType),
  });
  const stepOne = createActionNode(axiumSetBlockingMode({concepts}), {
    successNode: stepTwo,
    successNotes: {
      preposition: 'Immediately'
    },
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumName, axiumSetBlockingModeType),
  });

  const params: ActionStrategyParameters = {
    topic: addConceptsToAddQueThenBlockTopic,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const addConceptsFromQueThenUnblockTopic = 'Add Concepts from Que then set Axium Mode to Default';
export function addConceptsFromQueThenUnblockStrategy(conceptualSet: Concepts): ActionStrategy {
  const addConceptsFromQueSemaphore = getSemaphore(conceptualSet, axiumName, axiumAddConceptFromQueType);
  const setDefaultModeSemaphore = getSemaphore(conceptualSet, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(conceptualSet, axiumName, axiumOpenType);

  const stepThree = createActionNode(axiumOpen({open: true}), {
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
    failureNode: null,
    semaphore: openSemaphore,
  });
  const stepTwo = createActionNode(axiumSetDefaultMode({concepts: conceptualSet}), {
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
  });
  const stepOne = createActionNode(axiumAddConceptFromQue(),{
    semaphore: addConceptsFromQueSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'First'
    },
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: addConceptsFromQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/