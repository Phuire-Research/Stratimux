import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, getSemaphore, primeAction } from '../../../model/action';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumRegisterStreamsType, type RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { axiumInitializePrinciplesType } from '../qualities/initializePrinciples.quality';
import { axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';

export const initializeKey = 'Axium Initialize';
export function initializationStrategy(streams: RegisterStreamsPayload, concepts: Concept[]): ActionStrategy {
  const initSemaphore = getSemaphore(concepts, axiumInitializePrinciplesType);
  const registerSemaphore = getSemaphore(concepts, axiumRegisterStreamsType);
  const setDefaultModeSemaphore = getSemaphore(concepts, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(concepts, axiumOpenType);

  const stepFour: ActionNode = {
    actionType: axiumOpenType,
    semaphore: openSemaphore,
    successNode: null,
    payload: {concepts}
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
    payload: {concepts}
  };
  const stepTwo: ActionNode = {
    actionType: axiumInitializePrinciplesType,
    semaphore: initSemaphore,
    successNode: stepThree,
    payload: {concepts}
  };
  const stepOne: ActionNode = {
    actionType: axiumRegisterStreamsType,
    semaphore: registerSemaphore,
    successNode: stepTwo,
    payload: streams
  };

  const params: ActionStrategyParameters = {
    key: initializeKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}