"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultModeIndexQuality = exports.setDefaultModeIndexReducer = exports.axiumSetDefaultModeIndexType = void 0;
const concept_1 = require("../../../model/concept");
exports.axiumSetDefaultModeIndexType = 'set Axium\'s Default Mode Index';
function setDefaultModeIndexReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { defaultModeIndex: payload.index });
}
exports.setDefaultModeIndexReducer = setDefaultModeIndexReducer;
exports.setDefaultModeIndexQuality = (0, concept_1.createQuality)(exports.axiumSetDefaultModeIndexType, setDefaultModeIndexReducer, concept_1.createDefaultMethodCreator);
