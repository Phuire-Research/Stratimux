import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept} from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { counterAddType } from '../../counter/qualities/add.quality';
import { counterSubtractType } from '../../counter/qualities/subtract.quality';
import { counterName } from '../../counter/counter.concept';
import { counterSelectCount } from '../../counter/counter.selector';
import { ownershipBackTrackType } from '../../ownership/qualities/backTrack.quality';
import { ownershipName } from '../../ownership/ownership.concept';

export const countingTopic = 'Counting Strategy';
export function countingStrategy(): ActionStrategy {
  const backTrack: ActionNode = {
    actionType: ownershipBackTrackType,
    successNode: null,
    failureNode: null,
  };
  const stepFive: ActionNode = {
    actionType: counterAddType,
    successNode: null,
    failureNode: null,
    preposition: 'and finally',
    denoter: 'One.',
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepFour: ActionNode = {
    actionType: counterAddType,
    successNode: stepFive,
    preposition: '',
    denoter: 'One;',
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    successNode: stepFour,
    preposition: '',
    denoter: 'One;',
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    successNode: stepThree,
    preposition: '',
    denoter: 'One;',
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    successNode: stepTwo,
    preposition: '',
    denoter: 'One;',
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };

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
    failureNode: backTrack,
    preposition: 'and finally',
    denoter: 'One.',
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: stepFour,
    failureNode: backTrack,
    preposition: '',
    denoter: 'One;',
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    semaphore: subtractSemaphore,
    successNode: stepThree,
    failureNode: backTrack,
    preposition: '',
    denoter: 'One;',
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    semaphore: subtractSemaphore,
    successNode: stepTwo,
    failureNode: backTrack,
    preposition: '',
    denoter: 'One;',
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  };

  const params: ActionStrategyParameters = {
    topic: primedCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}