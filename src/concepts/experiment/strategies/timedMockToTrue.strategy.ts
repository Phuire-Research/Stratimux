/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will eventually set the Experiment's mock property
to true. This is accomplished via a timer emit action quality. That will then finally dispatch the setting action.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentMockToTrue } from '../qualities/mockToTrue.quality';
import { experimentTimerEmitAction } from '../qualities/timerEmitAction.quality';

export const experimentTimedMockToTrueTopic = 'This will use a async method to eventually set mock to True';
export function experimentTimedMockToTrue(): ActionStrategy {
  const stepTwo = createActionNode(experimentMockToTrue(), {
    successNode: null,
    failureNode: null,
  });
  const stepOne = createActionNode(experimentTimerEmitAction(), {
    successNode: stepTwo,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentTimedMockToTrueTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/