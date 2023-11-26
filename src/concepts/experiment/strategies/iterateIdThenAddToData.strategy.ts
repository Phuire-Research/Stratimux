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