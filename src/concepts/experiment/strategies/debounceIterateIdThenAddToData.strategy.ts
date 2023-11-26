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