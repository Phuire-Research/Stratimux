/*<$
For the asynchronous graph programming framework Stratimux generate an ActionStrategy that will randomly increment each
BeatSelectorChanges count variants for 100 steps.
$>*/
/*<#*/
import { ActionNode, ActionStrategy, createActionNode, createStrategy } from '../../../model/actionStrategy';
import { beatSelectorChangesAddToCountOne } from '../qualities/addToCountOne.quality';
import { beatSelectorChangesAddToCountThree } from '../qualities/addToCountThree.quality';
import { beatSelectorChangesAddToCountTwo } from '../qualities/addToCountTwo.quality';
import { beatSelectorChangesAddToCountFour } from '../qualities/addToCountFour.quality';
import { beatSelectorChangesAddToCountFive } from '../qualities/addToCountFive.quality';
import { beatSelectorChangesAddToCountSix } from '../qualities/addToCountSix.quality';
import { beatSelectorChangesAddToCountSeven } from '../qualities/addToCountSeven.quality';

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const generateRandomCountingStrategy = (): [
  [number, number, number, number, number, number, number],
  ActionStrategy,
  string
] => {
  const steps = 100;
  const variantTally = new Array(7).fill(0) as [number, number, number, number, number, number, number];
  const variants = [
    beatSelectorChangesAddToCountOne,
    beatSelectorChangesAddToCountTwo,
    beatSelectorChangesAddToCountThree,
    beatSelectorChangesAddToCountFour,
    beatSelectorChangesAddToCountFive,
    beatSelectorChangesAddToCountSix,
    beatSelectorChangesAddToCountSeven,
  ];
  let selection = Math.round(getRandomRange(0, 7));
  let previousStep: ActionNode =
    createActionNode(variants[Math.round(selection)](), {
      successNode: null,
      failureNode: null
    });
  const stepFirst = previousStep;
  variantTally[selection]++;
  for (let i = 0; i < steps; i++) {
    selection = Math.round(getRandomRange(0, 7));
    const newStep: ActionNode =
      createActionNode(variants[Math.round(selection)](), {
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