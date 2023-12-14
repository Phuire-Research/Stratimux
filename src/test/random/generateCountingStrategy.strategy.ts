import { ActionNode, ActionStrategy, createActionNode, createStrategy } from '../../model/actionStrategy';
import { counterAdd, counterAddType } from '../../concepts/counter/qualities/add.quality';
import { counterSubtract } from '../../concepts/counter/qualities/subtract.quality';

function getRandomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const generateRandomCountingStrategy = (count: number): [number, ActionStrategy] => {
  const length = Math.round(getRandomRange(1, 20));
  let numPos = 0;
  let numNeg = 0;
  let previousStep: ActionNode =
    createActionNode(Math.round(getRandomRange(1, 5)) % 2 === 0 ? counterAdd() : counterSubtract(), {
      successNode: null,
      failureNode: null
    });
  const stepFirst = previousStep;
  if (previousStep.actionType === counterAddType) {
    numPos++;
  } else {
    numNeg++;
  }
  for (let i = 1; i < length; i++) {
    const newStep: ActionNode =
      createActionNode(Math.round(getRandomRange(1, 5)) % 2 ? counterAdd() : counterSubtract(), {
        successNode: null,
        failureNode: null
      });
    if (newStep.actionType === counterAddType) {
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