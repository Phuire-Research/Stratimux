import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept} from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { counterAddType } from '../qualities/add.quality';
import { counterSubtractType } from '../qualities/subtract.quality';

export const countingKey = 'Counting Strategy';
export function countingStrategy(): ActionStrategy {
  const stepFive: ActionNode = {
    actionType: counterSubtractType,
    successNode: null
  };
  const stepFour: ActionNode = {
    actionType: counterAddType,
    successNode: stepFive,
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    successNode: stepFour,
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    successNode: stepThree,
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    successNode: stepTwo,
  };

  const params: ActionStrategyParameters = {
    key: countingKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}

export const primedCountingKey = 'Counting Strategy with Primed Actions';
export function primedCountingStrategy(concepts: Concept[]): ActionStrategy {
  const addSemaphore = getSemaphore(concepts, counterAddType);
  const subtractSemaphore = getSemaphore(concepts, counterSubtractType);
  const stepFour: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: null,
  };
  const stepThree: ActionNode = {
    actionType: counterAddType,
    semaphore: addSemaphore,
    successNode: stepFour,
  };
  const stepTwo: ActionNode = {
    actionType: counterSubtractType,
    semaphore: subtractSemaphore,
    successNode: stepThree,
  };
  const stepOne: ActionNode = {
    actionType: counterAddType,
    semaphore: subtractSemaphore,
    successNode: stepTwo,
  };

  const params: ActionStrategyParameters = {
    key: primedCountingKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}