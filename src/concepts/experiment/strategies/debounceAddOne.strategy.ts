/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a strategy that will debounce the step in the strategy.
The final step of the strategy will increment the Counter's count by one.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { counterAdd } from '../../counter/qualities/add.quality';
import { experimentDebounceNextActionNode } from '../qualities/debounceNextActionNode.quality';

export const experimentDebounceAddOneTopic = 'Debounce add one';
export function experimentDebounceAddOneStrategy(): ActionStrategy {
  const stepTwo = createActionNode(counterAdd(), {
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });
  const stepOne = createActionNode(experimentDebounceNextActionNode(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });

  return createStrategy({
    topic: experimentDebounceAddOneTopic,
    initialNode: stepOne,
  });
}
/*#>*/