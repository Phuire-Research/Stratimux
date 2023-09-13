import { Subject } from 'rxjs';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction, Action, createAction, getSemaphore} from '../../../model/action';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { AddConceptsFromQuePayload, axiumAddConceptFromQueType } from '../qualities/addConceptsFromQue.quality';
import { AppendConceptsToAddQuePayload, axiumAppendConceptsToAddQueType } from '../qualities/appendConceptsToAddQue.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';
import { axiumKey } from '../axium.concept';

// Step One to Add Concepts to Axium
export const addConceptsToAddQueThenBlockKey = 'Add Concepts to add que then set Axium Mode to Blocking';
export function addConceptsToAddQueThenBlockStrategy(concepts: Concept[], newConcepts: Concept[]) {
  const stepTwo: ActionNode = {
    actionType: axiumAppendConceptsToAddQueType,
    successNode: null,
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumKey, axiumAppendConceptsToAddQueType),
    payload: {concepts: newConcepts} as AppendConceptsToAddQuePayload,
    preposition: 'Then Safely'
  };
  const stepOne: ActionNode = {
    actionType: axiumSetBlockingModeType,
    successNode: stepTwo,
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumKey, axiumSetBlockingModeType),
    payload: {concepts} as AppendConceptsToAddQuePayload,
    preposition: 'Immediately'
  };

  const params: ActionStrategyParameters = {
    topic: addConceptsToAddQueThenBlockKey,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const addConceptsFromQueThenUnblockTopic = 'Add Concepts from Que then set Axium Mode to Default';
export function addConceptsFromQueThenUnblockStrategy(action$: Subject<Action>, conceptualSet: Concept[]): ActionStrategy {
  const addConceptsFromQueSemaphore = getSemaphore(conceptualSet, axiumKey, axiumAddConceptFromQueType);
  const setDefaultModeSemaphore = getSemaphore(conceptualSet, axiumKey, axiumSetDefaultModeType);
  const openSemaphore = getSemaphore(conceptualSet, axiumKey, axiumOpenType);

  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    successNode: null,
    failureNode: null,
    semaphore: openSemaphore,
    preposition: 'Reinstate',
    denoter: 'State.'
  };
  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: stepThree,
    failureNode: null,
    payload: {concepts: conceptualSet},
    preposition: 'Then'
  };
  const stepOne: ActionNode = {
    actionType: axiumAddConceptFromQueType,
    semaphore: addConceptsFromQueSemaphore,
    successNode: stepTwo,
    failureNode: null,
    payload: {action$} as AddConceptsFromQuePayload,
    preposition: 'First'
  };

  const params: ActionStrategyParameters = {
    topic: addConceptsFromQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}