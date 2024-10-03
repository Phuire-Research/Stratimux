/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept,
generate an ActionStrategy that will perform a series of counter actions that will
ultimately just increment the count by one.
$>*/
/*<#*/
import { createStrategy, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { CounterDeck, CounterQualities, CounterState } from '../counter.concept';
import { Deck } from '../../../model/deck';

export const countingTopic = 'Counting Strategy';
export function countingStrategy<T extends Deck<CounterDeck>>(deck: Partial<T>): ActionStrategy | undefined {
  if (deck.counter) {
    const {
      counterSubtract,
      counterAdd
    } = deck.counter.e;

    const stepFive = createActionNode(counterSubtract(), {
      successNotes: {
        preposition: 'and finally',
        denoter: 'One.',
      },
    });
    const stepFour = createActionNode(counterAdd(), {
      successNode: stepFive,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepThree = createActionNode(counterAdd(), {
      successNode: stepFour,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepTwo = createActionNode(counterSubtract(), {
      successNode: stepThree,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });
    const stepOne = createActionNode(counterAdd(), {
      successNode: stepTwo,
      successNotes: {
        preposition: '',
        denoter: 'One;',
      },
    });

    const params: ActionStrategyParameters = {
      topic: countingTopic,
      initialNode: stepOne,
    };

    return createStrategy(params);
  } else {
    return undefined;
  }
}

export const additionalCountingStrategyTopic = 'Additional Counting Strategy';
export function additionalCountingStrategy<T extends Deck<CounterDeck>>(deck: Partial<T>): ActionStrategy | undefined {
  if (deck.counter) {
    const strategy = countingStrategy(deck);
    if (strategy) {
      strategy.topic = additionalCountingStrategyTopic;
      return strategy;
    }
  }
  return undefined;
}
/*#>*/