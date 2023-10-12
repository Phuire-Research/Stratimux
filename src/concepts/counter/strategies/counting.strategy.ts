import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept} from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { counterAdd, counterAddType } from '../qualities/add.quality';
import { counterSubtract, counterSubtractType } from '../qualities/subtract.quality';
import { counterName } from '../counter.concept';

export const countingTopic = 'Counting Strategy';
export function countingStrategy(): ActionStrategy {
  const stepFive: ActionNode = createActionNode(counterSubtract(), {
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: null,
  });
  const stepFour: ActionNode = createActionNode(counterAdd(), {
    successNode: stepFive,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepThree: ActionNode = createActionNode(counterAdd(), {
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepTwo: ActionNode = createActionNode(counterSubtract(), {
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepOne: ActionNode = createActionNode(counterAdd(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: countingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}

export const primedCountingTopic = 'Counting Strategy with Primed Actions';
export function primedCountingStrategy(concepts: Concept[]): ActionStrategy {
  const addSemaphore = getSemaphore(concepts, counterName, counterAddType);
  const subtractSemaphore = getSemaphore(concepts, counterName, counterSubtractType);
  const stepFour: ActionNode = createActionNode(counterAdd(), {
    semaphore: addSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: null,
  });
  const stepThree: ActionNode = createActionNode(counterAdd(), {
    semaphore: addSemaphore,
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepTwo: ActionNode = createActionNode(counterSubtract(), {
    semaphore: subtractSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepOne: ActionNode = createActionNode(counterAdd(), {
    semaphore: subtractSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: primedCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}