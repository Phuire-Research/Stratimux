/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate an ActionStrategy that will iterate the Experiment's state ID.
Then notify the Muxium of its conclusion while appending the ID to the strategy's data field.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept.type';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentIterateIdThenReceiveInMethod } from '../qualities/iterateIdThenReceiveInMethod.quality';

const qs = {experimentIterateIdThenReceiveInMethod};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentIterateIdThenAddToDataDeck = Deck<ExperimentDeck>

export const experimentIterateIdThenAddToDataTopic = 'Iterate experiment ID then add to strategy data';
export function iterateIdThenAddToData(deck: ExperimentIterateIdThenAddToDataDeck): ActionStrategy {
  return createStrategy({
    topic: experimentIterateIdThenAddToDataTopic,
    initialNode: createActionNode(deck.experiment.e.experimentIterateIdThenReceiveInMethod())
  });
}
/*#>*/