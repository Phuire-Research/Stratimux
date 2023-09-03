import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept} from '../../../model/concept';
import { primeAction } from '../../../model/action';
import { add, subtract } from '../counter.concept';

export const countingKey = 'Counting Strategy';
export function countingStrategy(): ActionStrategy {
  const stepFive: ActionNode = {
    action: subtract,
    successNode: null
  };
  const stepFour: ActionNode = {
    action: add,
    successNode: stepFive,
  };
  const stepThree: ActionNode = {
    action: add,
    successNode: stepFour,
  };
  const stepTwo: ActionNode = {
    action: subtract,
    successNode: stepThree,
  };
  const stepOne: ActionNode = {
    action: add,
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
  const primedAdd = primeAction(concepts, add);
  const primedSubtract = primeAction(concepts, add);
  const stepFour: ActionNode = {
    action: primedAdd,
    successNode: null,
  };
  const stepThree: ActionNode = {
    action: primedAdd,
    successNode: stepFour,
  };
  const stepTwo: ActionNode = {
    action: primedSubtract,
    successNode: stepThree,
  };
  const stepOne: ActionNode = {
    action: primedAdd,
    successNode: stepTwo,
  };

  const params: ActionStrategyParameters = {
    key: primedCountingKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}