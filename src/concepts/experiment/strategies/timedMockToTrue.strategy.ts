/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will eventually set the Experiment's mock property
to true. This is accomplished via a timer emit action quality. That will then finally dispatch the setting action.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { experimentMockToTrue } from '../qualities/mockToTrue.quality';
import { experimentTimerEmitAction } from '../qualities/timerEmitAction.quality';

const qs = {
  experimentMockToTrue,
  experimentTimerEmitAction
};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentTimedMockToTrueDeck = Deck<ExperimentDeck>

export const experimentTimedMockToTrueTopic = 'This will use a async method to eventually set mock to True';
export function experimentTimedMockToTrue(deck: ExperimentTimedMockToTrueDeck): ActionStrategy {
  const stepTwo = createActionNode(deck.experiment.e.experimentMockToTrue());
  const stepOne = createActionNode(deck.experiment.e.experimentTimerEmitAction(), {
    successNode: stepTwo,
  });

  return createStrategy({
    topic: experimentTimedMockToTrueTopic,
    initialNode: stepOne,
  });
}
/*#>*/