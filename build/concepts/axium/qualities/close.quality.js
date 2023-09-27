"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeQuality = exports.closeReducer = exports.axiumClose = exports.axiumCloseType = void 0;
const concept_1 = require("../../../model/concept");
const action_1 = require("../../../model/action");
exports.axiumCloseType = 'Close Axium';
exports.axiumClose = (0, action_1.prepareActionCreator)(exports.axiumCloseType);
function closeReducer(state, _action) {
    var _a, _b;
    state.generalSubscribers.forEach(named => named.subscriber.unsubscribe());
    state.methodSubscribers.forEach(named => named.subscriber.unsubscribe());
    (_a = state.action$) === null || _a === void 0 ? void 0 : _a.complete();
    (_b = state.concepts$) === null || _b === void 0 ? void 0 : _b.complete();
    state.subConcepts$.complete();
    return Object.assign(Object.assign({}, state), { methodSubscribers: [], generalSubscribers: [] });
}
exports.closeReducer = closeReducer;
exports.closeQuality = (0, concept_1.createQuality)(exports.axiumCloseType, closeReducer);
