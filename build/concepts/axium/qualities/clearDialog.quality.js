"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDialogQuality = exports.clearDialogReducer = exports.axiumClearDialog = exports.axiumClearDialogType = void 0;
const concept_1 = require("../../../model/concept");
const action_1 = require("../../../model/action");
exports.axiumClearDialogType = 'clear Axium Dialog';
exports.axiumClearDialog = (0, action_1.prepareActionCreator)(exports.axiumClearDialogType);
function clearDialogReducer(state, action) {
    return Object.assign(Object.assign({}, state), { dialog: '' });
}
exports.clearDialogReducer = clearDialogReducer;
exports.clearDialogQuality = (0, concept_1.createQuality)(exports.axiumClearDialogType, clearDialogReducer, concept_1.defaultMethodCreator);
