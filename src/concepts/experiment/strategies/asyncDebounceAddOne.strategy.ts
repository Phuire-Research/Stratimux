/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a strategy that will debounce next action to be dispatched.
Then when the debounce time expires enacts the counter add one quality.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy, ActionStrategyParameters } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept';
import { Deck } from '../../../model/deck';
import { CounterDeck } from '../../counter/counter.concept';
import { ExperimentState } from '../experiment.concept';
import { experimentAsyncDebounceNextActionNode } from '../qualities/debounceAsyncNextActionNode.quality';

const qs = {experimentAsyncDebounceNextActionNode};
type ExperimentDeck = {
  experiment : Concept<ExperimentState, typeof qs>
}
export type ExperimentAsyncDebounceStrategyDeck = Deck<CounterDeck & ExperimentDeck>

export const experimentAsyncDebounceAddOneTopic = 'Async debounce add one';
export function experimentAsyncDebounceAddOneStrategy(deck: ExperimentAsyncDebounceStrategyDeck): ActionStrategy {
  const stepTwo = createActionNode(deck.counter.e.counterAdd(), {
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });
  const stepOne = createActionNode(deck.experiment.e.experimentAsyncDebounceNextActionNode(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });

  const params: ActionStrategyParameters = {
    topic: experimentAsyncDebounceAddOneTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}
/*#>*/