/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a strategy that will initialize the axium of its base functionality.
Within the Stratimux paradigm. Principles act as the start up script, or main function.
$>*/
/*<#*/
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

  const stepThree: ActionNode = createActionNode(axiumOpen({open: true}), {
    semaphore: openSemaphore,
    successNotes: {
      preposition: 'Finally',
      denoter: 'to Notify Subscribers of State changes.'
    },
  });
  const stepTwo: ActionNode = createActionNode(axiumSetDefaultMode({concepts}), {
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
  });
  const stepOne: ActionNode = createActionNode(axiumInitializePrinciples({concepts}),{
    semaphore: initSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Begin with'
    },
  });

  const params: ActionStrategyParameters = {
    topic: initializeTopic,
    initialNode: stepOne,
    priority: Infinity
  };

  return createStrategy(params);
}
/*#>*/