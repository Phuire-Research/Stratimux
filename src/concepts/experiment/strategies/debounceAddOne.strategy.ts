/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a strategy that will debounce the step in the strategy.
The final step of the strategy will increment the Counter's count by one.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { Concept } from '../../../model/concept/concept.type';
import { Deck } from '../../../model/deck';
import { CounterDeck } from '../../counter/counter.concept';
import { ExperimentState } from '../experiment.concept';
import { experimentDebounceNextActionNode } from '../qualities/debounceNextActionNode.quality';

const qs = {experimentDebounceNextActionNode};
type ExperimentDeck = {
  experiment : Concept<ExperimentState, typeof qs>
}
export type ExperimentAsyncIterateIdThenAddToDataDeck = Deck<ExperimentDeck & CounterDeck>

export const experimentDebounceAddOneTopic = 'Debounce add one';
export function experimentDebounceAddOneStrategy(deck: ExperimentAsyncIterateIdThenAddToDataDeck): ActionStrategy {
  const stepTwo = createActionNode(deck.counter.e.counterAdd(), {
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });
  const stepOne = createActionNode(deck.experiment.e.experimentDebounceNextActionNode(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    agreement: 1000,
  });

  return createStrategy({
    topic: experimentDebounceAddOneTopic,
    initialNode: stepOne,
  });
}
/*#>*/