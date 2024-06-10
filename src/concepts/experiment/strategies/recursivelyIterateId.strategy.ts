/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will cursively iterate the Experiment's state ID,
that is limited by an incoming array of strings.
$>*/
/*<#*/
import { ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentRecurseIterateId } from '../qualities/recurseIncrementId.quality';

const qs = {experimentRecurseIterateId};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentIterateIdThenAddToDataDeck = Deck<ExperimentDeck>

export const experimentRecursivelyIterateIdTopic = 'Recursively iterate experiment ID then add to strategy data';
export function experimentRecursivelyIterateId(
  deck: ExperimentIterateIdThenAddToDataDeck,
  controlling: string[]
): ActionStrategy {
  return createStrategy({
    topic: experimentRecursivelyIterateIdTopic,
    initialNode: createActionNode(deck.experiment.e.experimentRecurseIterateId({controlling}))
  });
}
/*#>*/