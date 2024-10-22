/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate an ActionStrategy that will iterate the Experiment's ID property,
then throttle the next action to be asynchronously dispatched from the quality's method. That will then set the current ID it has received
to the strategy's data field.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept.type';
import { Deck } from '../../../model/deck';
import { MuxiumDeck } from '../../muxium/muxium.concept';
import { ExperimentState } from '../experiment.concept';
import {
  experimentThrottleAsyncIterateIdThenReceiveInMethod
} from '../qualities/throttleAsyncIterateIdThenReceiveInMethod.quality';

const qs = {experimentThrottleAsyncIterateIdThenReceiveInMethod};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentThrottleAsyncIterateIdThenAddToDataDeck = Deck<ExperimentDeck & MuxiumDeck>

export const experimentThrottleAsyncIterateIdThenAddToDataTopic = 'Throttle Async iterate experiment ID then add to strategy data';
export function experimentThrottleAsyncIterateIdThenAddToData(
  deck: ExperimentThrottleAsyncIterateIdThenAddToDataDeck,
  setId: number
): ActionStrategy {
  return createStrategy({
    topic: experimentThrottleAsyncIterateIdThenAddToDataTopic,
    initialNode: createActionNode(deck.experiment.e.experimentThrottleAsyncIterateIdThenReceiveInMethod({setId}))
  });
}
/*#>*/