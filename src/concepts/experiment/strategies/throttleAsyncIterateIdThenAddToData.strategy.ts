/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate an ActionStrategy that will iterate the Experiment's ID property,
then throttle the next action to be asynchronously dispatched from the quality's method. That will then set the current ID it has received
to the strategy's data field.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import {
  experimentThrottleAsyncIterateIdThenReceiveInMethod
} from '../qualities/throttleAsyncIterateIdThenReceiveInMethod.quality';

export const experimentThrottleAsyncIterateIdThenAddToDataTopic = 'Throttle Async iterate experiment ID then add to strategy data';
export function experimentThrottleAsyncIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentThrottleAsyncIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentThrottleAsyncIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/