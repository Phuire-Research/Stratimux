import { createStrategy, ActionNode, ActionStrategy, ActionStrategyParameters, Concept, primeAction} from '../../../../mod.ts';
import { registerStreams, initializePrinciples, setDefaultMode } from '../axium.concept.ts';
import { log } from '../qualities/log.quality.ts';
import { open } from '../qualities/open.quality.ts';
import type { RegisterStreamsPayload } from '../qualities/registerStreams.quality.ts';

export function initializationStrategy(streams: RegisterStreamsPayload, concepts: Concept[]): ActionStrategy {
    const primedInit = primeAction(concepts, initializePrinciples);
    const primedRegister = primeAction(concepts, registerStreams);
    const primedSetDefaultMode = primeAction(concepts, setDefaultMode);
    const primedOpen = primeAction(concepts, open);
    
    const stepFour: ActionNode = {
        action: primedOpen,
        successNode: null,
        payload: {concepts}
    }
    // const stepThree: ActionNode = {
    //     action: primedSetDefaultMode,
    //     successNode: null,
    //     payload: {concepts}
    // }
    const stepThree: ActionNode = {
        action: primedSetDefaultMode,
        successNode: stepFour,
        payload: {concepts}
    }
    const stepTwo: ActionNode = {
        action: primedInit,
        successNode: stepThree,
        payload: {concepts}
    }
    const stepOne: ActionNode = {
        action: primedRegister,
        successNode: stepTwo,
        payload: streams
    }

    const params: ActionStrategyParameters = {
        initialNode: stepOne,
    }

    return createStrategy(params);
}