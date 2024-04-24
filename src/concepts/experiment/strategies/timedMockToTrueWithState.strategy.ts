/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate an ActionStrategy that will in the final step the Experiment's mock value to
true. While attaching the original mock value to the strategy's data field. Then once its timer expires, dispatch the next
step that will finally set the value to true. Then notify the axium of the strategy's successful conclusion.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentMockToTrue } from '../qualities/mockToTrue.quality';
import { experimentTimerEmitActionWithState } from '../qualities/timerEmitActionWithState.quality';

export const experimentTimedMockToTrueWithStateTopic =
  'This will use a async method to eventually set mock to True via State and append mock to strategy data.';
export function timedMockToTrueWithState(): ActionStrategy {
  const stepTwo = createActionNode(experimentMockToTrue());
  const stepOne = createActionNode(experimentTimerEmitActionWithState(), {
    successNode: stepTwo,
  });

  return createStrategy({
    topic: experimentTimedMockToTrueWithStateTopic,
    initialNode: stepOne,
  });
}
/*#>*/