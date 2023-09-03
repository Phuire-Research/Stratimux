import { Subject } from 'rxjs';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction, Action } from '../../../model/action';
import { registerStreams, initializePrinciples, setDefaultMode, setBlockingMode } from '../axium.concept';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import {  removeConceptsViaQue } from '../qualities/removeConceptsViaQue.quality';
import { AppendConceptsToRemoveQuePayload, appendConceptsToRemoveQue } from '../qualities/appendConceptsToRemoveQue.quality';
import { SetBlockingModePayload } from '../qualities/setBlockingMode.quality';
import { open } from '../qualities/open.quality';
import { SetDefaultModePayload } from '../qualities/setDefaultMode.quality';

export const addConceptsToRemovalQueThenBlockKey = 'Add Concepts to removal Que then set Axium Mode to Blocking';
export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
  const primedSetBlockingMode = primeAction(concepts, setBlockingMode);
  const primedAppendConceptsToRemoveQue = primeAction(concepts, appendConceptsToRemoveQue);
  const stepThree: ActionNode = {
    action: open,
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
  const primedRemoveConceptsViaQue = primeAction(concepts, removeConceptsViaQue);
  const primedSetDefaultMode = primeAction(concepts, setDefaultMode);

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