/*<$
For the asynchronous graph programming framework Stratimux generate an ActionStrategy that will randomly increment each
BeatSelectorChanges count variants for 100 steps.
$>*/
/*<#*/
import { ActionNode, ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { AxiumDeck } from '../../../model/axium';
import { Deck } from '../../../model/deck';
import { BeatSelectorChangesDeck } from '../beatSelectorChanges.concept';

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const generateRandomCountingStrategy = (deck: Deck<AxiumDeck & BeatSelectorChangesDeck>): [
  [number, number, number, number, number, number, number],
  ActionStrategy,
  string
] => {
  const steps = 100;
  const variantTally = new Array(7).fill(0) as [number, number, number, number, number, number, number];
  const {
    beatSelectorChangesAddToCountOne,
    beatSelectorChangesAddToCountTwo,
    beatSelectorChangesAddToCountThree,
    beatSelectorChangesAddToCountFour,
    beatSelectorChangesAddToCountFive,
    beatSelectorChangesAddToCountSix,
    beatSelectorChangesAddToCountSeven,
  } = deck.beatSelectors.e;
  const variants = [
    beatSelectorChangesAddToCountOne,
    beatSelectorChangesAddToCountTwo,
    beatSelectorChangesAddToCountThree,
    beatSelectorChangesAddToCountFour,
    beatSelectorChangesAddToCountFive,
    beatSelectorChangesAddToCountSix,
    beatSelectorChangesAddToCountSeven,
  ];
  let selection = Math.floor(getRandomRange(0, 6));
  let previousStep: ActionNode =
    createActionNode(variants[selection](), {
      successNode: null,
      failureNode: null
    });
  const stepFirst = previousStep;
  variantTally[selection]++;
  for (let i = 0; i < steps; i++) {
    selection = Math.round(getRandomRange(0, 6));
    const newStep: ActionNode =
      createActionNode(variants[selection](), {
        successNode: null,
        failureNode: null
      });
    variantTally[selection]++;

    previousStep.successNode = newStep;
    previousStep = newStep;
  }
  previousStep.successNode = null;

  const topic = `Generated Counting Strategy, using ${variantTally}`;
  return [
    variantTally,
    createStrategy({
      initialNode: stepFirst,
      topic,
    }),
    topic
  ];
};
/*#>*/