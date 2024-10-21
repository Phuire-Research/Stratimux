/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a strategy that will safely remove concepts
from the Muxium's concepts state property.
$>*/
/*<#*/
import { AnyConcept, Concepts } from '../../../model/concept';
import { Actions } from '../../../model/action/action.type';
import { MuxiumQualities } from '../qualities';
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy, ActionStrategyParameters } from '../../../model/action/strategy/actionStrategy.type';

export const addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Muxium Mode to Blocking';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addConceptsToRemovalQueThenBlockStrategy(
  a: Actions<MuxiumQualities>, concepts: Concepts, targetConcepts: Record<string, AnyConcept>
) {
  const stepTwo = createActionNode(a.muxiumAppendConceptsToRemoveQue({concepts: targetConcepts}), {
  });
  const stepOne = createActionNode(a.muxiumSetBlockingMode({concepts}), {
    successNode: stepTwo,
  });
  const params: ActionStrategyParameters = {
    topic: addConceptsToRemovalQueThenBlockTopic,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const removeConceptsViaQueThenUnblockTopic = 'Remove Concepts via Que then set Muxium Mode to Default';
export function removeConceptsViaQueThenUnblockStrategy(a: Actions<MuxiumQualities>, concepts: Concepts): ActionStrategy {
  const stepThree = createActionNode(a.muxiumOpen({open: true}), {
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
  });
  const stepTwo = createActionNode(a.muxiumSetDefaultMode({concepts}), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne = createActionNode(a.muxiumRemoveConceptsViaQue(), {
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