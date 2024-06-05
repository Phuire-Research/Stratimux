/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a strategy that will safely remove concepts
from the Axium's concepts state property.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { AnyConcept, Concepts } from '../../../model/concept';
import { Actions } from '../../../model/action';
import { AxiumQualities } from '../qualities';

export const addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Axium Mode to Blocking';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addConceptsToRemovalQueThenBlockStrategy(
  a: Actions<AxiumQualities>, concepts: Concepts, targetConcepts: AnyConcept[]
) {
  const stepTwo = createActionNode(a.axiumAppendConceptsToRemoveQueQuality({concepts: targetConcepts}), {
  });
  const stepOne = createActionNode(a.axiumSetBlockingModeQuality({concepts}), {
    successNode: stepTwo,
  });
  const params: ActionStrategyParameters = {
    topic: addConceptsToRemovalQueThenBlockTopic,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const removeConceptsViaQueThenUnblockTopic = 'Remove Concepts via Que then set Axium Mode to Default';
export function removeConceptsViaQueThenUnblockStrategy(a: Actions<AxiumQualities>, concepts: Concepts): ActionStrategy {
  const stepThree = createActionNode(a.axiumOpenQuality({open: true}), {
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
  });
  const stepTwo = createActionNode(a.axiumSetDefaultModeQuality({concepts}), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(a.axiumRemoveConceptsViaQueQuality(), {
    successNode: stepTwo,
    successNotes: {
      preposition: 'To Begin'
    },
  });

  const params: ActionStrategyParameters = {
    topic: removeConceptsViaQueThenUnblockTopic,
    initialNode: stepOne,
    priority: Infinity
  };

  return createStrategy(params);
}
/*#>*/