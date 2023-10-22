import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentRecurseIterateId } from '../qualities/recurseIncrementId.quality';

export const recursivelyIterateIdTopic = 'Recursively iterate experiment ID then add to strategy data';
export function recursivelyIterateId(controlling: string[]): ActionStrategy {
  const stepOne = createActionNode(experimentRecurseIterateId({controlling}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: recursivelyIterateIdTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}