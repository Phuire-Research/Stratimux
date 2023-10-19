import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { counterSelectCount } from '../../counter/counter.selector';
import { experimentMockTrue } from '../qualities/mockTrue.quality';
import { experimentTimerEmitAction } from '../qualities/timerEmitAction.quality';

export const timedMockToTrueTopic = 'This will use a async method to eventually set mock to True';
export function timedMockToTrue(): ActionStrategy {
  const stepTwo = createActionNode(experimentMockTrue(), {
    successNode: null,
    failureNode: null,
  });
  const stepOne = createActionNode(experimentTimerEmitAction(), {
    successNode: stepTwo,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: timedMockToTrueTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}