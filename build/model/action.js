"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareActionCreator = exports.createAction = exports.createCacheSemaphores = exports.getSemaphore = exports.primeAction = void 0;
const badAction_quality_1 = require("../concepts/axium/qualities/badAction.quality");
function primeAction(concepts, action, agreement) {
    for (const concept of concepts) {
        const semaphore = getSemaphore(concepts, concept.name, action.type);
        if (semaphore[2] !== -1) {
            return Object.assign(Object.assign({}, action), { semaphore: semaphore, expiration: Date.now() + (agreement !== undefined ? agreement : 5000) });
        }
    }
    return {
        type: badAction_quality_1.axiumBadActionType,
        semaphore: [0, 0, -1],
        expiration: Date.now() + 5000
    };
}
exports.primeAction = primeAction;
function getSemaphore(concepts, conceptName, actionType) {
    const axiumState = concepts[0].state;
    const cachedSemaphores = axiumState.cachedSemaphores;
    const conceptMap = cachedSemaphores.get(conceptName);
    if (conceptMap) {
        const qualitySemaphore = conceptMap.get(actionType);
        if (qualitySemaphore) {
            return qualitySemaphore;
        }
    }
    return [0, 0, -1];
}
exports.getSemaphore = getSemaphore;
function createCacheSemaphores(concepts) {
    const generation = concepts[0].state.generation;
    const newCachedSemaphores = new Map();
    concepts.forEach((concept, ci) => {
        const qualityMap = new Map();
        concept.qualities.forEach((quality, qi) => {
            qualityMap.set(quality.actionType, [ci, qi, generation]);
        });
        newCachedSemaphores.set(concept.name, qualityMap);
    });
    return newCachedSemaphores;
}
exports.createCacheSemaphores = createCacheSemaphores;
function createAction(type, payload, keyedSelectors, agreement, _semaphore) {
    const semaphore = _semaphore ? _semaphore : [0, 0, -1];
    return {
        type,
        semaphore,
        payload,
        keyedSelectors,
        // Temporary until we have proper SLA
        expiration: Date.now() + (agreement !== undefined ? agreement : 5000),
    };
}
exports.createAction = createAction;
function prepareActionCreator(actionType) {
    return (payload, keyedSelectors, agreement, _semaphore) => {
        return createAction(actionType, payload, keyedSelectors, agreement, _semaphore);
    };
}
exports.prepareActionCreator = prepareActionCreator;
