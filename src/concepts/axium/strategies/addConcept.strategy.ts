import { Subject } from 'rxjs';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction, Action, createAction} from '../../../model/action';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { AddConceptsFromQuePayload, axiumAddConceptFromQueType } from '../qualities/addConceptsFromQue.quality';
import { AppendConceptsToAddQuePayload, axiumAppendConceptsToAddQueType } from '../qualities/appendConceptsToAddQue.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';

// Step One to Add Concepts to Axium
export const addConceptsToAddQueThenBlockKey = 'Add Concepts to add que then set Axium Mode to Blocking';
export function addConceptsToAddQueThenBlockStrategy(concepts: Concept[], newConcepts: Concept[]) {
  // const primedSetBlockingMode = primeAction(conceptualSet, setBlockingMode);
  // const primedAppendConceptsToAddQue = primeAction(conceptualSet, appendConceptsToAddQue);
  const stepThree: ActionNode = {
    action: createAction(axiumOpenType),
    successNode: null,
  };
  const stepTwo: ActionNode = {
    action: createAction(axiumAppendConceptsToAddQueType),
    successNode: stepThree,
    payload: {concepts: newConcepts} as AppendConceptsToAddQuePayload
  };
  const stepOne: ActionNode = {
    action: createAction(axiumSetBlockingModeType),
    successNode: stepTwo,
    payload: {concepts} as AppendConceptsToAddQuePayload
  };

  const params: ActionStrategyParameters = {
    key: addConceptsToAddQueThenBlockKey,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const addConceptsFromQueThenUnblockKey = 'Add Concepts from Que then set Axium Mode to Default';
export function addConceptsFromQueThenUnblockStrategy(action$: Subject<Action>, conceptualSet: Concept[]): ActionStrategy {
  const primedAddConceptsFromQue = primeAction(conceptualSet, createAction(axiumAddConceptFromQueType));
  const primedSetDefaultMode = primeAction(conceptualSet, createAction(axiumSetDefaultModeType));

  const stepTwo: ActionNode = {
    action: primedSetDefaultMode,
    successNode: null,
    payload: {concepts: conceptualSet}
  };
  const stepOne: ActionNode = {
    action: primedAddConceptsFromQue,
    successNode: stepTwo,
    payload: {action$} as AddConceptsFromQuePayload
  };

  const params: ActionStrategyParameters = {
    key: addConceptsFromQueThenUnblockKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}