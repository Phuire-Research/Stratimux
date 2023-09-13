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
  // const primedSetBlockingMode = primeAction(conceptualSet, setBlockingMode);
  // const primedAppendConceptsToAddQue = primeAction(conceptualSet, appendConceptsToAddQue);
  const stepThree: ActionNode = {
    actionType: axiumOpenType,
    successNode: null,
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumKey, axiumOpenType),
  };
  const stepTwo: ActionNode = {
    actionType: axiumAppendConceptsToAddQueType,
    successNode: stepThree,
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumKey, axiumAppendConceptsToAddQueType),
    payload: {concepts: newConcepts} as AppendConceptsToAddQuePayload,
  };
  const stepOne: ActionNode = {
    actionType: axiumSetBlockingModeType,
    successNode: stepTwo,
    failureNode: null,
    semaphore: getSemaphore(concepts, axiumKey, axiumSetBlockingModeType),
    payload: {concepts} as AppendConceptsToAddQuePayload
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

  const stepTwo: ActionNode = {
    actionType: axiumSetDefaultModeType,
    semaphore: setDefaultModeSemaphore,
    successNode: null,
    failureNode: null,
    payload: {concepts: conceptualSet}
  };
  const stepOne: ActionNode = {
    actionType: axiumAddConceptFromQueType,
    semaphore: addConceptsFromQueSemaphore,
    successNode: stepTwo,
    failureNode: null,
    payload: {action$} as AddConceptsFromQuePayload
  };

  const params: ActionStrategyParameters = {
    topic: addConceptsFromQueThenUnblockTopic,
    initialNode: stepOne,
  };

  return createStrategy(params);
}