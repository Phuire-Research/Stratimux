/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a strategy that will initialize the muxium of its base functionality.
Within the Stratimux paradigm. Principles act as the start up script, or main function.
$>*/
/*<#*/
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concepts } from '../../../model/concept';
import { Actions } from '../../../model/action';
import { MuxiumQualities } from '../qualities';

export const initializeTopic = 'Muxium Initialization Strategy';
export function initializationStrategy(ax: Actions<MuxiumQualities>, concepts: Concepts): ActionStrategy {
  const stepThree: ActionNode = createActionNode(ax.muxiumOpen({open: true}), {
    successNotes: {
      preposition: 'Finally',
      denoter: 'to Notify Subscribers of State changes.'
    },
  });
  const stepTwo: ActionNode = createActionNode(ax.muxiumSetDefaultMode({concepts}), {
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne: ActionNode = createActionNode(ax.muxiumInitializePrinciples({concepts}),{
    successNode: stepTwo,
    successNotes: {
      preposition: 'Begin with'
    },
  });

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepOne,
    priority: Infinity
  };

  return createStrategy(params);
}
/*#>*/