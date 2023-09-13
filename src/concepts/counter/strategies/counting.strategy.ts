import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept} from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { counterAddType } from '../qualities/add.quality';
import { counterSubtractType } from '../qualities/subtract.quality';
import { counterKey } from '../counter.concept';

export const countingTopic = 'Counting Strategy';
export function countingStrategy(): ActionStrategy {
  const stepFive: ActionNode = {
    actionType: counterSubtractType,
    successNode: null,
    failureNode: null,
    preposition: 'and finally',
    denoter: 'One.',
  };
  const stepFour: ActionNode = {
    actionType: counterAddType,
    successNode: stepFive,
    preposition: '',
    denoter: 'One;',
    failureNode: null,
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    successNode: stepFour,
    preposition: '',
    denoter: 'One;',
    failureNode: null,
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    successNode: stepThree,
    preposition: '',
    denoter: 'One;',
    failureNode: null,
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    successNode: stepTwo,
    preposition: '',
    denoter: 'One;',
    failureNode: null,
  };

  const params: ActionStrategyParameters = {
    topic: countingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}

export const primedCountingTopic = 'Counting Strategy with Primed Actions';
export function primedCountingStrategy(concepts: Concept[]): ActionStrategy {
  const addSemaphore = getSemaphore(concepts, counterKey, counterAddType);
  const subtractSemaphore = getSemaphore(concepts, counterKey, counterSubtractType);
  const stepFour: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: null,
    failureNode: null,
    preposition: 'and finally',
    denoter: 'One.',
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: stepFour,
    failureNode: null,
    preposition: '',
    denoter: 'One;',
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    semaphore: subtractSemaphore,
    successNode: stepThree,
    failureNode: null,
    preposition: '',
    denoter: 'One;',
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    semaphore: subtractSemaphore,
    successNode: stepTwo,
    failureNode: null,
    preposition: '',
    denoter: 'One;',
  };

  const params: ActionStrategyParameters = {
    topic: primedCountingTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}