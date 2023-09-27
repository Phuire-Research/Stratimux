"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badActionQuality = exports.badActionReducer = exports.axiumBadActionType = void 0;
const concept_1 = require("../../../model/concept");
exports.axiumBadActionType = 'Axium received a Bad Action';
function badActionReducer(state, action) {
    if (state.logging) {
        console.log('Axium Received a Bad Action: ', action);
    }
    return Object.assign({}, state);
}
exports.badActionReducer = badActionReducer;
exports.badActionQuality = (0, concept_1.createQuality)(exports.axiumBadActionType, badActionReducer);
