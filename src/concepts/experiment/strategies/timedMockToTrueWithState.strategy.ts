/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate an ActionStrategy that will in the final step the Experiment's mock value to
true. While attaching the original mock value to the strategy's data field. Then once its timer expires, dispatch the next
step that will finally set the value to true. Then notify the muxium of the strategy's successful conclusion.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept.type';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentMockToTrue } from '../qualities/mockToTrue.quality';
import { experimentTimerEmitActionWithState } from '../qualities/timerEmitActionWithState.quality';

const qs = {
  experimentMockToTrue,
  experimentTimerEmitActionWithState
};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentTimedMockToTrueWithStateDeck = Deck<ExperimentDeck>

export const experimentTimedMockToTrueWithStateTopic =
  'This will use a async method to eventually set mock to True via State and append mock to strategy data.';
export function timedMockToTrueWithState(deck: ExperimentTimedMockToTrueWithStateDeck): ActionStrategy {
  const stepTwo = createActionNode(deck.experiment.e.experimentMockToTrue());
  const stepOne = createActionNode(deck.experiment.e.experimentTimerEmitActionWithState(), {
    successNode: stepTwo,
  });

  return createStrategy({
    topic: experimentTimedMockToTrueWithStateTopic,
    initialNode: stepOne,
  });
}
/*#>*/