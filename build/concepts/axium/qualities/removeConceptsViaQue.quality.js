"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeConceptsViaQueQuality = exports.removeConceptsViaQueReducer = exports.axiumRemoveConceptsViaQueType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
exports.axiumRemoveConceptsViaQueType = 'remove Concepts via Axium\'s Removal Concept Que';
function removeConceptsViaQueReducer(state, _action) {
    const methodSubscribers = state.methodSubscribers;
    const newMethodSubscribers = [];
    const generalSubscribers = state.methodSubscribers;
    const newGeneralSubscribers = [];
    const removeConceptQue = state.removeConceptQue;
    methodSubscribers.forEach(named => {
        let exists = false;
        removeConceptQue.forEach(concept => {
            if (concept.name === named.name) {
                exists = true;
            }
        });
        if (!exists) {
            newMethodSubscribers.push(named);
        }
        else {
            named.subscriber.unsubscribe();
        }
    });
    generalSubscribers.forEach(named => {
        let exists = false;
        removeConceptQue.forEach(concept => {
            if (concept.name === named.name) {
                exists = true;
            }
        });
        if (!exists) {
            newGeneralSubscribers.push(named);
        }
        else {
            named.subscriber.unsubscribe();
        }
    });
    return Object.assign(Object.assign({}, state), { 
        // generation: state.generation + 1,
        methodSubscribers: newMethodSubscribers, generalSubscribers: newGeneralSubscribers, removeConceptQue: [] });
}
exports.removeConceptsViaQueReducer = removeConceptsViaQueReducer;
exports.removeConceptsViaQueQuality = (0, concept_2.createQuality)(exports.axiumRemoveConceptsViaQueType, removeConceptsViaQueReducer, concept_1.defaultMethodCreator);
