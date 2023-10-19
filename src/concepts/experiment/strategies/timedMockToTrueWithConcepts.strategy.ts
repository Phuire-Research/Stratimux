import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { counterSelectCount } from '../../counter/counter.selector';
import { experimentMockTrue } from '../qualities/mockTrue.quality';
import { experimentTimerEmitActionWithConcepts } from '../qualities/timerEmitActionWithConcepts.quality';

export const timedMockToTrueWithConceptsTopic =
  'This will use a async method to eventually set mock to TrueWithConcepts and append mock to strategy data.';
export function timedMockToTrueWithConcepts(): ActionStrategy {
  const stepTwo = createActionNode(experimentMockTrue(), {
    successNode: null,
    failureNode: null,
  });
  const stepOne = createActionNode(experimentTimerEmitActionWithConcepts(), {
    successNode: stepTwo,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: timedMockToTrueWithConceptsTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}