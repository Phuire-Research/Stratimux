/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate an ActionStrategy that will iterate the Experiment ID,
then debounce notify the Axium of its conclusion while appending the ID to its data field.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentDebounceIterateIdThenReceiveInMethod } from '../qualities/debounceIterateIdThenReceiveInMethod.quality';

export const experimentDebounceIterateIdThenAddToDataTopic = 'Debounce iterate experiment ID then add to strategy data';
export function experimentDebounceIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentDebounceIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentDebounceIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/