"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStreamsQuality = exports.registerStreamsReducer = exports.axiumRegisterStreamsType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
exports.axiumRegisterStreamsType = 'register Axium Action and Concept Streams';
function registerStreamsReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { action$: payload.action$, concepts$: payload.concepts$ });
}
exports.registerStreamsReducer = registerStreamsReducer;
exports.registerStreamsQuality = (0, concept_2.createQuality)(exports.axiumRegisterStreamsType, registerStreamsReducer, concept_1.createDefaultMethodCreator);
