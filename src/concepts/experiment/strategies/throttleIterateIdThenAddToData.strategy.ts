import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentThrottleIterateIdThenReceiveInMethod } from '../qualities/throttleIterateIdThenReceiveInMethod.quality';

export const experimentThrottleIterateIdThenAddToDataTopic = 'Throttle iterate experiment ID then add to strategy data';
export function experimentThrottleIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentThrottleIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentThrottleIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}