import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentDebounceAsyncIterateIdThenReceiveInMethod } from '../qualities/debounceAsyncIterateIdThenReceiveInMethod.quality copy 2';

export const debounceAsyncIterateIdThenAddToDataTopic = 'Debounce async iterate experiment ID then add to strategy data';
export function debounceAsyncIterateIdThenAddToData(setId: number): ActionStrategy {
  const stepOne = createActionNode(experimentDebounceAsyncIterateIdThenReceiveInMethod({setId}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: debounceAsyncIterateIdThenAddToDataTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}