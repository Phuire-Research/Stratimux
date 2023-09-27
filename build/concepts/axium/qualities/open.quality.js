"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openQuality = exports.openReducer = exports.axiumOpen = exports.axiumOpenType = void 0;
const concept_1 = require("../../../model/concept");
const action_1 = require("../../../model/action");
exports.axiumOpenType = 'Open Axium';
exports.axiumOpen = (0, action_1.prepareActionCreator)(exports.axiumOpenType);
function openReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { open: (payload === null || payload === void 0 ? void 0 : payload.open) ? payload.open : true });
}
exports.openReducer = openReducer;
exports.openQuality = (0, concept_1.createQuality)(exports.axiumOpenType, openReducer, concept_1.defaultMethodCreator);
