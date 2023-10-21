import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentThrottleIterateIdThenReceiveInMethod } from '../qualities/throttleIterateIdThenReceiveInMethod.quality';

export const throttleIterateIdThenAddToDataTopic = 'Throttle iterate experiment ID then add to strategy data';
export function throttleIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentThrottleIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: throttleIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}