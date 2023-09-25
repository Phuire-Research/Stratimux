import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumRegisterStreamsType, type RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { axiumInitializePrinciplesType } from '../qualities/initializePrinciples.quality';
import { axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';

export const initializeTopic = 'Axium Initialization Strategy';
export function initializationStrategy(concepts: Concept[]): ActionStrategy {
  const initSemaphore = getSemaphore(concepts, axiumName, axiumInitializePrinciplesType);
  const registerSemaphore = getSemaphore(concepts, axiumName, axiumRegisterStreamsType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(concepts, axiumName, axiumOpenType);

  const stepFour: ActionNode = {
    actionType: axiumOpenType,
    semaphore: openSemaphore,
    successNode: null,
    failureNode: null,
    payload: {concepts},
    preposition: 'Finally',
    denoter: 'to Notify Subscribers of State changes.'
  };
  // const stepThree: ActionNode = {
  //     action: primedSetDefaultMode,
  //     successNode: null,
  //     payload: {concepts}
  // }
  const stepThree: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepFour,
    failureNode: null,
    payload: {concepts},
    preposition: 'Then'
  };
  const stepTwo: ActionNode = {
    actionType: axiumInitializePrinciplesType,
    semaphore: initSemaphore,
    successNode: stepThree,
    failureNode: null,
    payload: {concepts},
    preposition: 'Begin with'
  };
  // const stepOne: ActionNode = {
  //   actionType: axiumRegisterStreamsType,
  //   semaphore: registerSemaphore,
  //   successNode: stepTwo,
  //   failureNode: null,
  //   payload: streams,
  //   preposition: 'Begin with'
  // };

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepTwo,
  };

  return createStrategy(params);
}