/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will take ownership of the Counter's count state property.
Then proceed to increment and decrement the count over a sequence that in total only increments to count by one.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept, } from '../../../model/concept';
import { CounterDeck, } from '../../counter/counter.concept';
import { counterSelectCount } from '../../counter/counter.selector';
import { OwnershipDeck } from '../../ownership/ownership.concept';
import { experimentCheckInStrategy } from '../qualities/checkInStrategy.quality';
import { Deck } from '../../../model/deck';
import { ExperimentState } from '../experiment.concept';
import { Quality } from '../../../model/quality';

const qs = {experimentCheckInStrategy};
type ExperimentDeck = {experiment: Concept<ExperimentState, typeof qs>};
export type ExperimentCountingDeck = Deck<OwnershipDeck & CounterDeck & ExperimentDeck>

export const experimentCountingTopic = 'Counting Strategy';
export function experimentCountingStrategy(deck: ExperimentCountingDeck): ActionStrategy {
  const {
    counterSubtract,
    counterAdd
  } = deck.counter.e;
  const backTrack = createActionNode(deck.ownership.e.ownershipBackTrack());
  const stepFive = createActionNode(counterSubtract(),{
    successNotes: {
      preposition: 'and finally',
      denoter: 'One.',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepFour = createActionNode(counterAdd(), {
    successNode: stepFive,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepThree = createActionNode(counterAdd(), {
    successNode: stepFour,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepTwo = createActionNode(counterSubtract(), {
    successNode: stepThree,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });
  const stepOne = createActionNode(counterAdd(), {
    successNode: stepTwo,
    successNotes: {
      preposition: '',
      denoter: 'One;',
    },
    failureNode: backTrack,
    agreement: 1000,
    keyedSelectors: [counterSelectCount]
  });

  return createStrategy({
    topic: experimentCountingTopic,
    initialNode: stepOne,
  });
}
/*#>*/