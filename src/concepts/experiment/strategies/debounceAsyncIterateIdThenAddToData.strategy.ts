/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a single step strategy that will iterate the Experiment state ID,
then debounce and asynchronously notify the Axium of the strategy's conclusion.
$>*/
/*<#*/
import { ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentDebounceAsyncIterateIdThenReceiveInMethod } from '../qualities/debounceAsyncIterateIdThenReceiveInMethod.quality';

export const experimentDebounceAsyncIterateIdThenAddToDataTopic = 'Debounce async iterate experiment ID then add to strategy data';
export function experimentDebounceAsyncIterateIdThenAddToData(setId: number): ActionStrategy {
  return createStrategy({
    topic: experimentDebounceAsyncIterateIdThenAddToDataTopic,
    initialNode: createActionNode(experimentDebounceAsyncIterateIdThenReceiveInMethod({setId}))
  });
}
/*#>*/