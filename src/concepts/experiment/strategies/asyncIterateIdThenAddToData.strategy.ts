/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate an ActionStrategy that will dispatch the
async iterate id that will later notify the Axium of its conclusion.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentAsyncIterateIdThenReceiveInMethod } from '../qualities/asyncIterateIdThenReceiveInMethod.quality';

const qs = {experimentAsyncIterateIdThenReceiveInMethod};
type ExperimentDeck = {
  experiment : Concept<ExperimentState, typeof qs>
}
export type ExperimentAsyncIterateIdThenAddToDataDeck = Deck<ExperimentDeck>

export const experimentAsyncIterateIdThenAddToDataTopic = 'Async iterate experiment ID then add to strategy data';
export function experimentAsyncIterateIdThenAddToData(deck: ExperimentAsyncIterateIdThenAddToDataDeck): ActionStrategy {
  const params: ActionStrategyParameters = {
    topic: experimentAsyncIterateIdThenAddToDataTopic,
    initialNode: createActionNode(deck.experiment.e.experimentAsyncIterateIdThenReceiveInMethod())
  };

  return createStrategy(params);
}
/*#>*/