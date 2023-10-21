import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import {
  experimentThrottleAsyncIterateIdThenReceiveInMethod
} from '../qualities/throttleAsyncIterateIdThenReceiveInMethod.quality';

export const throttleAsyncIterateIdThenAddToDataTopic = 'Throttle Async iterate experiment ID then add to strategy data';
export function throttleAsyncIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentThrottleAsyncIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: throttleAsyncIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}