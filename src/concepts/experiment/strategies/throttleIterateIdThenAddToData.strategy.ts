/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will iterate an ID state property for the Concept
Experiment. Then dispatch the first action for a period that is received in the action's method. That will then
unify the the ID the method has received onto the strategy's state field. Then finally notify the Axium of the
strategy's conclusion.
$>*/
/*<#*/
import { ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentThrottleIterateIdThenReceiveInMethod } from '../qualities/throttleIterateIdThenReceiveInMethod.quality';

export const experimentThrottleIterateIdThenAddToDataTopic = 'Throttle iterate experiment ID then add to strategy data';
export function experimentThrottleIterateIdThenAddToData(setId: number): ActionStrategy {
  return createStrategy({
    topic: experimentThrottleIterateIdThenAddToDataTopic,
    initialNode: createActionNode(experimentThrottleIterateIdThenReceiveInMethod({setId}))
  });
}
/*#>*/