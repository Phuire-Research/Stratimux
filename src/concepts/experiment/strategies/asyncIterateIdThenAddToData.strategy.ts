/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate an ActionStrategy that will dispatch the
async iterate id that will later notify the Axium of its conclusion.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentAsyncIterateIdThenReceiveInMethod } from '../qualities/asyncIterateIdThenReceiveInMethod.quality';

export const experimentAsyncIterateIdThenAddToDataTopic = 'Async iterate experiment ID then add to strategy data';
export function experimentAsyncIterateIdThenAddToData(): ActionStrategy {
  const params: ActionStrategyParameters = {
    topic: experimentAsyncIterateIdThenAddToDataTopic,
    initialNode: createActionNode(experimentAsyncIterateIdThenReceiveInMethod())
  };

  return createStrategy(params);
}
/*#>*/