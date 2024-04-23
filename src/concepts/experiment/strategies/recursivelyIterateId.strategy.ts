/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will cursively iterate the Experiment's state ID,
that is limited by an incoming array of strings.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentRecurseIterateId } from '../qualities/recurseIncrementId.quality';

export const experimentRecursivelyIterateIdTopic = 'Recursively iterate experiment ID then add to strategy data';
export function experimentRecursivelyIterateId(controlling: string[]): ActionStrategy {
  const stepOne = createActionNode(experimentRecurseIterateId({controlling}), {
    successNode: null,
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: experimentRecursivelyIterateIdTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/