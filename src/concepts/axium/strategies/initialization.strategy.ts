import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters, createActionNode } from '../../../model/actionStrategy';
import { Concepts } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumOpen, axiumOpenType } from '../qualities/open.quality';
import { axiumInitializePrinciples, axiumInitializePrinciplesType } from '../qualities/initializePrinciples.quality';
import { axiumSetDefaultMode, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

export const initializeTopic = 'Axium Initialization Strategy';
export function initializationStrategy(concepts: Concepts): ActionStrategy {
  const initSemaphore = getSemaphore(concepts, axiumName, axiumInitializePrinciplesType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(concepts, axiumName, axiumOpenType);

  const stepThree: ActionNode = createActionNode(axiumOpen(true), {
    semaphore: openSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Finally',
      denoter: 'to Notify Subscribers of State changes.'
    },
    failureNode: null,
  });
  const stepTwo: ActionNode = createActionNode(axiumSetDefaultMode({concepts}), {
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
  });
  const stepOne: ActionNode = createActionNode(axiumInitializePrinciples({concepts}),{
    semaphore: initSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Begin with'
    },
    failureNode: null,
  });

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}