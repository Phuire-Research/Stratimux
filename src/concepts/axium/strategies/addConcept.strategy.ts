/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate an ActionStrategy that will add new concepts into the Axium's conceptual set.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { AnyConcept, Concepts } from '../../../model/concept';
import { Actions } from '../../../model/action';
import { AxiumQualities } from '../qualities';

// Step One to Add Concepts to Axium
export const addConceptsToAddQueThenBlockTopic = 'Add Concepts to add que then set Axium Mode to Blocking';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addConceptsToAddQueThenBlockStrategy(
  e: Actions<AxiumQualities>,
  concepts: Concepts,
  newConcepts: Record<string, AnyConcept>
) {
  const stepTwo = createActionNode(e.axiumAppendConceptsToAddQue({concepts: newConcepts}),{
    successNode: null,
    successNotes: {
      preposition: 'Then Safely'
    },
  });
  const stepOne = createActionNode(e.axiumSetBlockingMode({concepts}), {
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
export function addConceptsFromQueThenUnblockStrategy(e: Actions<AxiumQualities>, conceptualSet: Concepts): ActionStrategy {
  const stepThree = createActionNode(e.axiumOpen({open: true}), {
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
  });
  const stepTwo = createActionNode(e.axiumSetDefaultMode({concepts: conceptualSet}), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(e.axiumAddConceptsFromQue(),{
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