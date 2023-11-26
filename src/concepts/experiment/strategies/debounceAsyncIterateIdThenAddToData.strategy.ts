import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentDebounceAsyncIterateIdThenReceiveInMethod } from '../qualities/debounceAsyncIterateIdThenReceiveInMethod.quality';

export const experimentDebounceAsyncIterateIdThenAddToDataTopic = 'Debounce async iterate experiment ID then add to strategy data';
export function experimentDebounceAsyncIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentDebounceAsyncIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentDebounceAsyncIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}