import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { counterSelectCount } from '../../counter/counter.selector';
import { experimentMockTrue } from '../qualities/mockTrue.quality';
import { experimentTimerEmitActionWithState } from '../qualities/timerEmitActionWithState.quality';

export const timedMockToTrueWithStateTopic =
  'This will use a async method to eventually set mock to True via State and append mock to strategy data.';
export function timedMockToTrueWithState(): ActionStrategy {
  const stepTwo = createActionNode(experimentMockTrue(), {
    successNode: null,
    failureNode: null,
  });
  const stepOne = createActionNode(experimentTimerEmitActionWithState(), {
    successNode: stepTwo,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: timedMockToTrueWithStateTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}