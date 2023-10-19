import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { counterAdd } from '../../counter/qualities/add.quality';
import { experimentAsyncDebounceNextActionNode } from '../qualities/debounceAsyncNextActionNode.quality';
import { experimentDebounceNextActionNode } from '../qualities/debounceNextActionNode.quality';

export const experimentAsyncDebounceAddOneTopic = 'Async debounce add one';
export function experimentAsyncDebounceAddOneStrategy(): ActionStrategy {
  const stepTwo = createActionNode(counterAdd(), {
    successNode: null,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
    agreement: 1000,
  });
  const stepOne = createActionNode(experimentAsyncDebounceNextActionNode(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
    agreement: 1000,
  });

  const params: ActionStrategyParameters = {
    topic: experimentAsyncDebounceAddOneTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}