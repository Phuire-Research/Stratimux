"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendConceptsToAddQueQuality = exports.appendConceptsToAddQueReducer = exports.axiumAppendConceptsToAddQueType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
exports.axiumAppendConceptsToAddQueType = 'append Concepts to Axium\'s Add Concept Que';
function appendConceptsToAddQueReducer(state, action) {
    const payload = action.payload;
    const addConceptQue = [
        ...payload.concepts
    ];
    return Object.assign(Object.assign({}, state), { addConceptQue });
}
exports.appendConceptsToAddQueReducer = appendConceptsToAddQueReducer;
exports.appendConceptsToAddQueQuality = (0, concept_2.createQuality)(exports.axiumAppendConceptsToAddQueType, appendConceptsToAddQueReducer, concept_1.defaultMethodCreator);
