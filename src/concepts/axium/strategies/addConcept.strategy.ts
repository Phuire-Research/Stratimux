import { Subject } from 'rxjs';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { Action, getSemaphore} from '../../../model/action';
import { AddConceptsFromQuePayload, axiumAddConceptFromQueType } from '../qualities/addConceptsFromQue.quality';
import { AppendConceptsToAddQuePayload, axiumAppendConceptsToAddQueType } from '../qualities/appendConceptsToAddQue.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { SetDefaultModePayload, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumName } from '../axium.concept';
import { createPayload } from '../../../model/selector';

// Step One to Add Concepts to Axium
export const addConceptsToAddQueThenBlockTopic = 'Add Concepts to add que then set Axium Mode to Blocking';
export function addConceptsToAddQueThenBlockStrategy(concepts: Concept[], newConcepts: Concept[]) {
  const stepTwo: ActionNode = {
    actionType: axiumAppendConceptsToAddQueType,
    successNode: null,
    successNotes: {
      preposition: 'Then Safely'
    },
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumName, axiumAppendConceptsToAddQueType),
    payload: createPayload<AppendConceptsToAddQuePayload>({concepts: newConcepts}),
  };
  const stepOne: ActionNode = {
    actionType: axiumSetBlockingModeType,
    successNode: stepTwo,
    successNotes: {
      preposition: 'Immediately'
    },
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumName, axiumSetBlockingModeType),
    payload: createPayload<AppendConceptsToAddQuePayload>({concepts}),
  };

  const params: ActionStrategyParameters = {
    topic: addConceptsToAddQueThenBlockTopic,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const addConceptsFromQueThenUnblockTopic = 'Add Concepts from Que then set Axium Mode to Default';
export function addConceptsFromQueThenUnblockStrategy(action$: Subject<Action>, conceptualSet: Concept[]): ActionStrategy {
  const addConceptsFromQueSemaphore = getSemaphore(conceptualSet, axiumName, axiumAddConceptFromQueType);
  const setDefaultModeSemaphore = getSemaphore(conceptualSet, axiumName, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(conceptualSet, axiumName, axiumOpenType);

  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    successNode: null,
    successNotes: {
      preposition: 'Reinstate',
      denoter: 'State.'
    },
    failureNode: null,
    semaphore: openSemaphore,
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    successNotes: {
      preposition: 'Then'
    },
    failureNode: null,
    payload: createPayload<SetDefaultModePayload>({concepts: conceptualSet}),
  };
  const stepOne: ActionNode = {
    actionType: axiumAddConceptFromQueType,
    semaphore: addConceptsFromQueSemaphore,
    successNode: stepTwo,
    successNotes: {
      preposition: 'First'
    },
    failureNode: null,
    payload: createPayload<AddConceptsFromQuePayload>({action$}),
  };

  const params: ActionStrategyParameters = {
    topic: addConceptsFromQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}