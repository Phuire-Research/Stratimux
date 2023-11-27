/*<$
For the graph programming framework Stratimux and Counter Concept,
generate an ActionStrategy that will perform a series of counter actions that will
ultimately just increment the count by one.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concepts} from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { counterAdd, counterAddType } from '../qualities/add.quality';
import { counterSubtract, counterSubtractType } from '../qualities/subtract.quality';
import { counterName } from '../counter.concept';

export const countingTopic = 'Counting Strategy';
export function countingStrategy(): ActionStrategy {
  const stepFive = createActionNode(counterSubtract(), {
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: null,
  });
  const stepFour = createActionNode(counterAdd(), {
    successNode: stepFive,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepThree = createActionNode(counterAdd(), {
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepTwo = createActionNode(counterSubtract(), {
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepOne = createActionNode(counterAdd(), {
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
/*#>*/
/*<$
For the graph programming framework Stratimux and Counter Concept,
generate a strategy that will ultimately increment the Counter's count by one.
This strategy should likewise accept concepts to allow for a base Counter Concept to prime its action's semaphore.
$>*/
/*<#*/
export const primedCountingTopic = 'Counting Strategy with Primed Actions';
export function primedCountingStrategy(concepts: Concepts): ActionStrategy {
  const addSemaphore = getSemaphore(concepts, counterName, counterAddType);
  const subtractSemaphore = getSemaphore(concepts, counterName, counterSubtractType);
  const stepFour = createActionNode(counterAdd(), {
    semaphore: addSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: null,
  });
  const stepThree = createActionNode(counterAdd(), {
    semaphore: addSemaphore,
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepTwo = createActionNode(counterSubtract(), {
    semaphore: subtractSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: null,
  });
  const stepOne = createActionNode(counterAdd(), {
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
/*#>*/