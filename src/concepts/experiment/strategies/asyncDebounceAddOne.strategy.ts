/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a strategy that will debounce next action to be dispatched.
Then when the debounce time expires enacts the counter add one quality.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { counterAdd } from '../../counter/qualities/add.quality';
import { experimentAsyncDebounceNextActionNode } from '../qualities/debounceAsyncNextActionNode.quality';

export const experimentAsyncDebounceAddOneTopic = 'Async debounce add one';
export function experimentAsyncDebounceAddOneStrategy(): ActionStrategy {
  const stepTwo = createActionNode(counterAdd(), {
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });
  const stepOne = createActionNode(experimentAsyncDebounceNextActionNode(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });

  const params: ActionStrategyParameters = {
    topic: experimentAsyncDebounceAddOneTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/