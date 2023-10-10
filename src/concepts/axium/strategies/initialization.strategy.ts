import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { getSemaphore } from '../../../model/action';
import { OpenPayload, axiumOpenType } from '../qualities/open.quality';
import { InitializePrinciplesPayload, axiumInitializePrinciplesType } from '../qualities/initializePrinciples.quality';
import { SetDefaultModePayload, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';
import { createPayload } from '../../../model/selector';

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
    payload: createPayload<OpenPayload>({open: true}),
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
    payload: createPayload<SetDefaultModePayload>({concepts}),
  };
  const stepOne: ActionNode = {
    actionType: axiumInitializePrinciplesType,
    semaphore: initSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Begin with'
    },
    failureNode: null,
    payload: createPayload<InitializePrinciplesPayload>({concepts}),
  };

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}