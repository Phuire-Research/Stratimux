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
    failureNode: null,
    payload: {concepts},
    preposition: 'Finally',
    denoter: 'to Notify Subscribers of State changes.'
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    failureNode: null,
    payload: {concepts},
    preposition: 'Then'
  };
  const stepOne: ActionNode = {
    actionType: axiumInitializePrinciplesType,
    semaphore: initSemaphore,
    successNode: stepTwo,
    failureNode: null,
    payload: {concepts},
    preposition: 'Begin with'
  };

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}