/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate an ActionStrategy that will add new concepts into the Muxium's conceptual set.
$>*/
/*<#*/
import { AnyConcept, Concepts } from '../../../model/concept/concept.type';
import { Actions } from '../../../model/action/action.type';
import { MuxiumQualities } from '../qualities';
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy, ActionStrategyParameters } from '../../../model/action/strategy/actionStrategy.type';

// Step One to Add Concepts to Muxium
export const addConceptsToAddQueThenBlockTopic = 'Add Concepts to add que then set Muxium Mode to Blocking';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addConceptsToAddQueThenBlockStrategy(
  e: Actions<MuxiumQualities>,
  concepts: Concepts,
  newConcepts: Record<string, AnyConcept>
) {
  const stepTwo = createActionNode(e.muxiumAppendConceptsToAddQue({concepts: newConcepts}),{
    successNode: null,
    successNotes: {
      preposition: 'Then Safely'
    },
  });
  const stepOne = createActionNode(e.muxiumSetBlockingMode({concepts}), {
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
export const addConceptsFromQueThenUnblockTopic = 'Add Concepts from Que then set Muxium Mode to Default';
export function addConceptsFromQueThenUnblockStrategy(e: Actions<MuxiumQualities>, conceptualSet: Concepts): ActionStrategy {
  const stepThree = createActionNode(e.muxiumOpen({open: true}), {
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
  });
  const stepTwo = createActionNode(e.muxiumSetDefaultMode({concepts: conceptualSet}), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(e.muxiumAddConceptsFromQue(),{
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