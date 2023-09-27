"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDialogQuality = exports.clearDialogReducer = exports.axiumClearDialogType = void 0;
const concept_1 = require("../../../model/concept");
exports.axiumClearDialogType = 'clear Axium Dialog';
function clearDialogReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { dialog: '' });
}
exports.clearDialogReducer = clearDialogReducer;
exports.clearDialogQuality = (0, concept_1.createQuality)(exports.axiumClearDialogType, clearDialogReducer, concept_1.createDefaultMethodCreator);
