"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendConceptsToRemoveQueQuality = exports.appendConceptsToRemoveQueReducer = exports.axiumAppendConceptsToRemoveQueType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
exports.axiumAppendConceptsToRemoveQueType = 'append Concepts to Axium\'s Remove Concept Que';
function appendConceptsToRemoveQueReducer(state, action) {
    const payload = action.payload;
    let removeQue = state.removeConceptQue;
    removeQue = [
        ...removeQue,
        ...payload.concepts
    ];
    return Object.assign(Object.assign({}, state), { removeConceptQue: removeQue });
}
exports.appendConceptsToRemoveQueReducer = appendConceptsToRemoveQueReducer;
exports.appendConceptsToRemoveQueQuality = (0, concept_2.createQuality)(exports.axiumAppendConceptsToRemoveQueType, appendConceptsToRemoveQueReducer, concept_1.createDefaultMethodCreator);
