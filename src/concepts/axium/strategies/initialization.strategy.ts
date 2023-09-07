import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { createAction, primeAction } from '../../../model/action';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumRegisterStreamsType, type RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { axiumInitializePrinciplesType } from '../qualities/initializePrinciples.quality';
import { axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';

export const initializeKey = 'Axium Initialize';
export function initializationStrategy(streams: RegisterStreamsPayload, concepts: Concept[]): ActionStrategy {
  const primedInit = primeAction(concepts, createAction(axiumInitializePrinciplesType));
  const primedRegister = primeAction(concepts, createAction(axiumRegisterStreamsType));
  const primedSetDefaultMode = primeAction(concepts, createAction(axiumSetDefaultModeType));
  const primedOpen = primeAction(concepts, createAction(axiumOpenType));

  const stepFour: ActionNode = {
    action: primedOpen,
    successNode: null,
    payload: {concepts}
  };
  // const stepThree: ActionNode = {
  //     action: primedSetDefaultMode,
  //     successNode: null,
  //     payload: {concepts}
  // }
  const stepThree: ActionNode = {
    action: primedSetDefaultMode,
    successNode: stepFour,
    payload: {concepts}
  };
  const stepTwo: ActionNode = {
    action: primedInit,
    successNode: stepThree,
    payload: {concepts}
  };
  const stepOne: ActionNode = {
    action: primedRegister,
    successNode: stepTwo,
    payload: streams
  };

  const params: ActionStrategyParameters = {
    key: initializeKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}