import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumInitializePrinciplesType } from '../qualities/initializePrinciples.quality';
import { axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

export const initializeTopic = 'Axium Initialization Strategy';
export function initializationStrategy(concepts: Concept[]): ActionStrategy {
  const initSemaphore = getSemaphore(concepts, axiumName, axiumInitializePrinciplesType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(concepts, axiumName, axiumOpenType);

  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    semaphore: openSemaphore,
    successNode: null,
    successNotes: {
      preposition: 'Finally',
      denoter: 'to Notify Subscribers of State changes.'
    },
    failureNode: null,
    payload: {concepts},
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
    payload: {concepts},
  };
  const stepOne: ActionNode = {
    actionType: axiumInitializePrinciplesType,
    semaphore: initSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Begin with'
    },
    failureNode: null,
    payload: {concepts},
  };

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}