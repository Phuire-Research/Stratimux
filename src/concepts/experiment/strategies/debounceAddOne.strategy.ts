/*<$
For the graph programming framework Stratimux and Experiment Concept, generate a strategy that will debounce the step in the strategy.
The final step of the strategy will increment the Counter's count by one.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { counterAdd } from '../../counter/qualities/add.quality';
import { experimentDebounceNextActionNode } from '../qualities/debounceNextActionNode.quality';

export const experimentDebounceAddOneTopic = 'Debounce add one';
export function experimentDebounceAddOneStrategy(): ActionStrategy {
  const stepTwo = createActionNode(counterAdd(), {
    successNode: null,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
    agreement: 1000,
  });
  const stepOne = createActionNode(experimentDebounceNextActionNode(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
    agreement: 1000,
  });

  const params: ActionStrategyParameters = {
    topic: experimentDebounceAddOneTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/