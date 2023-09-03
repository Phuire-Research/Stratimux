import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction } from '../../../model/action';
import { registerStreams, initializePrinciples, setDefaultMode } from '../axium.concept';
import { log } from '../qualities/log.quality';
import { open } from '../qualities/open.quality';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality';

export const initializeKey = 'Axium Initialize';
export function initializationStrategy(streams: RegisterStreamsPayload, concepts: Concept[]): ActionStrategy {
  const primedInit = primeAction(concepts, initializePrinciples);
  const primedRegister = primeAction(concepts, registerStreams);
  const primedSetDefaultMode = primeAction(concepts, setDefaultMode);
  const primedOpen = primeAction(concepts, open);

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