import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, Concepts} from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { counterAdd, counterAddType } from '../../counter/qualities/add.quality';
import { counterSubtract, counterSubtractType } from '../../counter/qualities/subtract.quality';
import { counterName } from '../../counter/counter.concept';
import { counterSelectCount } from '../../counter/counter.selector';
import { ownershipBackTrack, ownershipBackTrackType } from '../../ownership/qualities/backTrack.quality';
import { ownershipName } from '../../ownership/ownership.concept';

export const experimentCountingTopic = 'Counting Strategy';
export function experimentCountingStrategy(): ActionStrategy {
  const backTrack = createActionNode(ownershipBackTrack(), {
    successNode: null,
    failureNode: null,
  });
  const stepFive = createActionNode(counterSubtract(),{
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepFour = createActionNode(counterAdd(), {
    successNode: stepFive,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepThree = createActionNode(counterAdd(), {
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepTwo = createActionNode(counterSubtract(), {
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepOne = createActionNode(counterAdd(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });

  const params: ActionStrategyParameters = {
    topic: experimentCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}

export const experimentPrimedCountingTopic = 'Counting Strategy with Primed Actions';
export function experimentPrimedCountingStrategy(concepts: Concepts): ActionStrategy {
  const addSemaphore = getSemaphore(concepts, counterName, counterAddType);
  const subtractSemaphore = getSemaphore(concepts, counterName, counterSubtractType);
  const backTrackSemaphore = getSemaphore(concepts, ownershipName, ownershipBackTrackType);
  const backTrack = createActionNode(ownershipBackTrack(), {
    semaphore: backTrackSemaphore,
    successNode: null,
    failureNode: null,
  });
  const stepFour = createActionNode(counterAdd(), {
    semaphore: addSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepThree = createActionNode(counterAdd(), {
    semaphore: addSemaphore,
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepTwo = createActionNode(counterSubtract(), {
    semaphore: subtractSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepOne = createActionNode(counterAdd(), {
    semaphore: subtractSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });

  const params: ActionStrategyParameters = {
    topic: experimentPrimedCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}