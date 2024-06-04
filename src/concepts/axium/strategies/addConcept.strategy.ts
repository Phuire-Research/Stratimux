/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate an ActionStrategy that will add new concepts into the Axium's conceptual set.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts } from '../../../model/concept';
import { Actions, getSemaphore} from '../../../model/action';
import { axiumAddConceptFromQue, axiumAddConceptFromQueType } from '../qualities/addConceptsFromQue.quality';
import { axiumAppendConceptsToAddQue, axiumAppendConceptsToAddQueType } from '../qualities/appendConceptsToAddQue.quality';
import { axiumOpen, axiumOpenType } from '../qualities/open.quality';
import { axiumSetBlockingMode, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumSetDefaultMode, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { AxiumQualities, axiumName } from '../axium.concept';

// Step One to Add Concepts to Axium
export const addConceptsToAddQueThenBlockTopic = 'Add Concepts to add que then set Axium Mode to Blocking';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addConceptsToAddQueThenBlockStrategy(ax: Actions<AxiumQualities>, concepts: Concepts, newConcepts: Concept<any>[]) {
  const stepTwo = createActionNode(ax.axiumAppendConceptsToAddQueQuality({concepts: newConcepts}),{
    successNode: null,
    successNotes: {
      preposition: 'Then Safely'
    },
  });
  const stepOne = createActionNode(ax.axiumSetBlockingModeQuality({concepts}), {
    successNode: stepTwo,
    successNotes: {
      preposition: 'Immediately'
    },
  });

  const params: ActionStrategyParameters = {
    topic: addConceptsToAddQueThenBlockTopic,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const addConceptsFromQueThenUnblockTopic = 'Add Concepts from Que then set Axium Mode to Default';
export function addConceptsFromQueThenUnblockStrategy(ax: Actions<AxiumQualities>, conceptualSet: Concepts): ActionStrategy {
  const stepThree = createActionNode(ax.axiumOpenQuality({open: true}), {
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
  });
  const stepTwo = createActionNode(ax.axiumSetDefaultModeQuality({concepts: conceptualSet}), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(ax.axiumAddConceptsFromQueQuality(),{
    successNode: stepTwo,
    successNotes: {
      preposition: 'First'
    },
  });

  const params: ActionStrategyParameters = {
    topic: addConceptsFromQueThenUnblockTopic,
    initialNode: stepOne,
    priority: Infinity
  };

  return createStrategy(params);
}
/*#>*/