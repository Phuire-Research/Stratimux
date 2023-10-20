import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentAsyncIterateIdThenReceiveInMethod } from '../qualities/asyncIterateIdThenReceiveInMethod.quality copy';

export const asyncIterateIdThenAddToDataTopic = 'Async iterate experiment ID then add to strategy data';
export function asyncIterateIdThenAddToData(): ActionStrategy {
  const stepOne = createActionNode(experimentAsyncIterateIdThenReceiveInMethod(), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: asyncIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}