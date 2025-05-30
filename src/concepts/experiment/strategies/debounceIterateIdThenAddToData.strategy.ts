/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate an ActionStrategy that will iterate the Experiment ID,
then debounce notify the Muxium of its conclusion while appending the ID to its data field.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept.type';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentDebounceIterateIdThenReceiveInMethod } from '../qualities/debounceIterateIdThenReceiveInMethod.quality';

const qs = {experimentDebounceIterateIdThenReceiveInMethod};
type ExperimentDeck = {
  experiment : Concept<ExperimentState, typeof qs>
}
export type ExperimentDebounceAsyncIterateIdThenAddToDataDeck = Deck<ExperimentDeck>

export const experimentDebounceIterateIdThenAddToDataTopic = 'Debounce iterate experiment ID then add to strategy data';
export function experimentDebounceIterateIdThenAddToData(
  deck: ExperimentDebounceAsyncIterateIdThenAddToDataDeck,
  setId: number
): ActionStrategy {
  return createStrategy({
    topic: experimentDebounceIterateIdThenAddToDataTopic,
    initialNode: createActionNode(deck.experiment.e.experimentDebounceIterateIdThenReceiveInMethod({
      setId
    }))
  });
}
/*#>*/