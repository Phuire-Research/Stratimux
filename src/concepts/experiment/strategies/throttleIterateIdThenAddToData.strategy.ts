/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will iterate an ID state property for the Concept
Experiment. Then dispatch the first action for a period that is received in the action's method. That will then
unify the the ID the method has received onto the strategy's state field. Then finally notify the Axium of the
strategy's conclusion.
$>*/
/*<#*/
import { ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentThrottleIterateIdThenReceiveInMethod } from '../qualities/throttleIterateIdThenReceiveInMethod.quality';

const qs = {experimentThrottleIterateIdThenReceiveInMethod};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentThrottleIterateIdThenAddToDataDeck = Deck<ExperimentDeck>

export const experimentThrottleIterateIdThenAddToDataTopic = 'Throttle iterate experiment ID then add to strategy data';
export function experimentThrottleIterateIdThenAddToData(
  deck: ExperimentThrottleIterateIdThenAddToDataDeck,
  setId: number
): ActionStrategy {
  return createStrategy({
    topic: experimentThrottleIterateIdThenAddToDataTopic,
    initialNode: createActionNode(deck.experiment.e.experimentThrottleIterateIdThenReceiveInMethod({setId}))
  });
}
/*#>*/