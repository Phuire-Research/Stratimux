/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a single step strategy that will iterate the Experiment state ID,
then debounce and asynchronously notify the Muxium of the strategy's conclusion.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentDebounceAsyncIterateIdThenReceiveInMethod } from '../qualities/debounceAsyncIterateIdThenReceiveInMethod.quality';

const qs = {experimentDebounceAsyncIterateIdThenReceiveInMethod};
type ExperimentDeck = {
  experiment : Concept<ExperimentState, typeof qs>
}
export type ExperimentDebounceAsyncIterateIdThenAddToDataDeck = Deck<ExperimentDeck>

export const experimentDebounceAsyncIterateIdThenAddToDataTopic = 'Debounce async iterate experiment ID then add to strategy data';
export function experimentDebounceAsyncIterateIdThenAddToData(
  deck: ExperimentDebounceAsyncIterateIdThenAddToDataDeck,
  setId: number
): ActionStrategy {
  return createStrategy({
    topic: experimentDebounceAsyncIterateIdThenAddToDataTopic,
    initialNode: createActionNode(deck.experiment.e.experimentDebounceAsyncIterateIdThenReceiveInMethod({setId}))
  });
}
/*#>*/