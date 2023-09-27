"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConceptsFromQueQuality = exports.axiumAddConceptFromQueType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
const axium_1 = require("../../../model/axium");
exports.axiumAddConceptFromQueType = 'Add Concepts from Axium Concept Que';
function addConceptsFromQueReducer(state, _) {
    const methodSubscribers = state.methodSubscribers;
    const addConceptsQue = state.addConceptQue;
    addConceptsQue.forEach(concept => {
        concept.qualities.forEach(quality => {
            if (quality.methodCreator) {
                [quality.method, quality.subject] = quality.methodCreator(state.subConcepts$);
                const methodSub = quality.method.subscribe((action) => {
                    const action$ = state.action$;
                    (0, axium_1.blockingMethodSubscription)(action$, action);
                });
                methodSubscribers.push({ name: concept.name, subscriber: methodSub });
            }
        });
    });
    return Object.assign(Object.assign({}, state), { methodSubscribers, addConceptQue: [] });
}
exports.addConceptsFromQueQuality = (0, concept_2.createQuality)(exports.axiumAddConceptFromQueType, addConceptsFromQueReducer, concept_1.createDefaultMethodCreator);
