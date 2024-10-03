import { ActionNode, ActionStrategy, createActionNode, createStrategy } from '../../model/actionStrategy';
import { Deck } from '../../model/deck';
import { CounterDeck } from '../../concepts/counter/counter.concept';

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export type GenerateRandomCountingStrategyDeck = Deck<CounterDeck>;

export const generateRandomCountingStrategy = (deck: GenerateRandomCountingStrategyDeck,  count: number): [number, ActionStrategy] => {
  const {
    counterAdd,
    counterSubtract
  } = deck.counter.e;
  const length = Math.round(getRandomRange(1, 20));
  let numPos = 0;
  let numNeg = 0;
  const firstAction = Math.round(getRandomRange(1, 5)) % 2 === 0 ? counterAdd() : counterSubtract();
  let previousStep: ActionNode = createActionNode(firstAction, {
    successNode: null,
    failureNode: null
  });
  const stepFirst = previousStep;
  if (deck.counter.c.counterAdd(firstAction)) {
    numPos++;
  } else {
    numNeg++;
  }
  for (let i = 1; i < length; i++) {
    const newAction = Math.round(getRandomRange(1, 5)) % 2 ? counterAdd() : counterSubtract();
    const newStep: ActionNode =
      createActionNode(newAction, {
        successNode: null,
        failureNode: null
      });
    if (deck.counter.c.counterAdd(newAction)) {
      numPos++;
    } else {
      numNeg++;
    }

    previousStep.successNode = newStep;
    previousStep = newStep;
  }
  previousStep.successNode = null;

  const topic = `Generated Counting Strategy from: ${count}, using ${numPos} Adds and ${numNeg} Subtracts`;
  return [
    numPos - numNeg,
    createStrategy({
      initialNode: stepFirst,
      topic,
    })];
};