import { Subject } from 'npm:rxjs@^7.8.1';
import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters, Concept, primeAction, Action} from '../../../../mod.ts';
import { registerStreams, initializePrinciples, setDefaultMode, setBlockingMode } from '../axium.concept.ts';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality.ts';
import {  removeConceptsViaQue } from '../qualities/removeConceptsViaQue.quality.ts';
import { AppendConceptsToRemoveQuePayload, appendConceptsToRemoveQue } from '../qualities/appendConceptsToRemoveQue.quality.ts';
import { SetBlockingModePayload } from '../qualities/setBlockingMode.quality.ts';
import { open } from '../qualities/open.quality.ts';
import { SetDefaultModePayload } from '../qualities/setDefaultMode.quality.ts';

export function addConceptsToRemovalQueThenBlockStrategy(concepts: Concept[], targetConcepts: Concept[]) {
    const primedSetBlockingMode = primeAction(concepts, setBlockingMode);
    const primedAppendConceptsToRemoveQue = primeAction(concepts, appendConceptsToRemoveQue);
    const stepThree: ActionNode = {
        action: open,
        successNode: null,
    }
    const stepTwo: ActionNode = {
        action: primedAppendConceptsToRemoveQue,
        successNode: stepThree,
        payload: {concepts: targetConcepts} as AppendConceptsToRemoveQuePayload
    }
    const stepOne: ActionNode = {
        action: primedSetBlockingMode,
        successNode: stepTwo,
        payload: {concepts} as SetBlockingModePayload
    }
    const params: ActionStrategyParameters = {
        initialNode: stepOne
    }
    return createStrategy(params);
}
// Step Two
export function removeConceptsViaQueThenUnblockStrategy(concepts: Concept[]): ActionStrategy {
    const primedRemoveConceptsViaQue = primeAction(concepts, removeConceptsViaQue);
    const primedSetDefaultMode = primeAction(concepts, setDefaultMode);

    const stepTwo: ActionNode = {
        action: primedSetDefaultMode,
        successNode: null,
        payload: {concepts} as SetDefaultModePayload
    }
    const stepOne: ActionNode = {
        action: primedRemoveConceptsViaQue,
        successNode: stepTwo,
    }

    const params: ActionStrategyParameters = {
        initialNode: stepOne,
    }

    return createStrategy(params);
}