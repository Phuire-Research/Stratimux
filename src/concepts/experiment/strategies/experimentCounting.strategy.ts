import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept} from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { counterAddType } from '../../counter/qualities/add.quality';
import { counterSubtractType } from '../../counter/qualities/subtract.quality';
import { counterName } from '../../counter/counter.concept';
import { counterSelectCount } from '../../counter/counter.selector';
import { ownershipBackTrackType } from '../../ownership/qualities/backTrack.quality';
import { ownershipName } from '../../ownership/ownership.concept';

export const experimentCountingTopic = 'Counting Strategy';
export function experimentCountingStrategy(): ActionStrategy {
  const backTrack: ActionNode = {
    actionType: ownershipBackTrackType,
    successNode: null,
    failureNode: null,
  };
  const stepFive: ActionNode = {
    actionType: counterSubtractType,
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepFour: ActionNode = {
    actionType: counterAddType,
    successNode: stepFive,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };

  const params: ActionStrategyParameters = {
    topic: experimentCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}

export const experimentPrimedCountingTopic = 'Counting Strategy with Primed Actions';
export function experimentPrimedCountingStrategy(concepts: Concept[]): ActionStrategy {
  const addSemaphore = getSemaphore(concepts, counterName, counterAddType);
  const subtractSemaphore = getSemaphore(concepts, counterName, counterSubtractType);
  const backTrackSemaphore = getSemaphore(concepts, ownershipName, ownershipBackTrackType);
  const backTrack: ActionNode = {
    actionType: ownershipBackTrackType,
    semaphore: backTrackSemaphore,
    successNode: null,
    failureNode: null,
  };
  const stepFour: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    semaphore: subtractSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    semaphore: subtractSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };

  const params: ActionStrategyParameters = {
    topic: experimentPrimedCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}