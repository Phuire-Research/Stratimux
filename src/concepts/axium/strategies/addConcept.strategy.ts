import { Subject } from 'rxjs';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters } from '../../../model/actionStrategy';
import { Concept } from '../../../model/concept';
import { primeAction, Action} from '../../../model/action';
import { registerStreams, initializePrinciples, setDefaultMode, setBlockingMode } from '../axium.concept';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality';
import { AddConceptsFromQuePayload, addConceptsFromQue } from '../qualities/addConceptsFromQue.quality';
import { AppendConceptsToAddQuePayload, appendConceptsToAddQue } from '../qualities/appendConceptsToAddQue.quality';
import { open } from '../qualities/open.quality';

// Step One to Add Concepts to Axium
export function addConceptsToAddQueThenBlockStrategy(concepts: Concept[], newConcepts: Concept[]) {
  // const primedSetBlockingMode = primeAction(conceptualSet, setBlockingMode);
  // const primedAppendConceptsToAddQue = primeAction(conceptualSet, appendConceptsToAddQue);
  const stepThree: ActionNode = {
    action: open,
    successNode: null,
  };
  const stepTwo: ActionNode = {
    action: appendConceptsToAddQue,
    successNode: stepThree,
    payload: {concepts: newConcepts} as AppendConceptsToAddQuePayload
  };
  const stepOne: ActionNode = {
    action: setBlockingMode,
    successNode: stepTwo,
    payload: {concepts} as AppendConceptsToAddQuePayload
  };

  const params: ActionStrategyParameters = {
    initialNode: stepOne
  };
  return createStrategy(params);
}
// Step Two
export function addConceptsFromQueThenUnblockStrategy(action$: Subject<Action>, conceptualSet: Concept[]): ActionStrategy {
  const primedAddConceptsFromQue = primeAction(conceptualSet, addConceptsFromQue);
  const primedSetDefaultMode = primeAction(conceptualSet, setDefaultMode);

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
    initialNode: stepOne,
  };

  return createStrategy(params);
}