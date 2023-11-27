/*<$
For the framework Stratimux and Experiment Concept, generate an ActionStrategy that will iterate the Experiment's state ID.
Then notify the Axium of its conclusion while appending the ID to the strategy's data field.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentIterateIdThenReceiveInMethod } from '../qualities/iterateIdThenReceiveInMethod.quality';

export const experimentIterateIdThenAddToDataTopic = 'Iterate experiment ID then add to strategy data';
export function iterateIdThenAddToData(): ActionStrategy {
  const stepOne = createActionNode(experimentIterateIdThenReceiveInMethod(), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/