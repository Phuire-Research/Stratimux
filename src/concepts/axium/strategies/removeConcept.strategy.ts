import { Subject } from 'rxjs';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction, Action, createAction } from '../../../model/action';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { axiumRemoveConceptsViaQueType } from '../qualities/removeConceptsViaQue.quality';
import { AppendConceptsToRemoveQuePayload, axiumAppendConceptsToRemoveQueType } from '../qualities/appendConceptsToRemoveQue.quality';
import { SetBlockingModePayload, axiumSetBlockingModeType } from '../qualities/setBlockingMode.quality';
import { axiumOpenType } from '../qualities/open.quality';
import { SetDefaultModePayload, axiumSetDefaultModeType } from '../qualities/setDefaultMode.quality';

export const addConceptsToRemovalQueThenBlockKey = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
  const primedSetBlockingMode = primeAction(concepts, createAction(axiumSetBlockingModeType));
  const primedAppendConceptsToRemoveQue = primeAction(concepts, createAction(axiumAppendConceptsToRemoveQueType));
  const primedOpen = primeAction(concepts, createAction(axiumOpenType));
  const stepThree: ActionNode = {
    action: primedOpen,
    successNode: null,
  };
  const stepTwo: ActionNode = {
    action: primedAppendConceptsToRemoveQue,
    successNode: stepThree,
    payload: {concepts: targetConcepts} as AppendConceptsToRemoveQuePayload
  };
  const stepOne: ActionNode = {
    action: primedSetBlockingMode,
    successNode: stepTwo,
    payload: {concepts} as SetBlockingModePayload
  };
  const params: ActionStrategyParameters = {
    key: addConceptsToRemovalQueThenBlockKey,
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export const removeConceptsViaQueThenUnblockKey = 'Remove Concepts via Que then set Axium Mode to Default';
export function removeConceptsViaQueThenUnblockStrategy(concepts: Concept[]): ActionStrategy {
  const primedRemoveConceptsViaQue = primeAction(concepts, createAction(axiumRemoveConceptsViaQueType));
  const primedSetDefaultMode = primeAction(concepts, createAction(axiumSetDefaultModeType));

  const stepTwo: ActionNode = {
    action: primedSetDefaultMode,
    successNode: null,
    payload: {concepts} as SetDefaultModePayload
  };
  const stepOne: ActionNode = {
    action: primedRemoveConceptsViaQue,
    successNode: stepTwo,
  };

  const params: ActionStrategyParameters = {
    key: removeConceptsViaQueThenUnblockKey,
    initialNode: stepOne,
  };

  return createStrategy(params);
}