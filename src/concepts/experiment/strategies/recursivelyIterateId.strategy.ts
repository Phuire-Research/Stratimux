/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will cursively iterate the Experiment's state ID,
that is limited by an incoming array of strings.
$>*/
/*<#*/
import { ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { experimentRecurseIterateId } from '../qualities/recurseIncrementId.quality';

export const experimentRecursivelyIterateIdTopic = 'Recursively iterate experiment ID then add to strategy data';
export function experimentRecursivelyIterateId(controlling: string[]): ActionStrategy {
  return createStrategy({
    topic: experimentRecursivelyIterateIdTopic,
    initialNode: createActionNode(experimentRecurseIterateId({controlling}))
  });
}
/*#>*/