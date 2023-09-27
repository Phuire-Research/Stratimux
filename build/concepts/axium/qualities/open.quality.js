"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openQuality = exports.openReducer = exports.axiumOpenType = void 0;
const concept_1 = require("../../../model/concept");
exports.axiumOpenType = 'Open Axium';
function openReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { open: (payload === null || payload === void 0 ? void 0 : payload.open) ? payload.open : true });
}
exports.openReducer = openReducer;
exports.openQuality = (0, concept_1.createQuality)(exports.axiumOpenType, openReducer, concept_1.createDefaultMethodCreator);
