"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareChainQuality = exports.prepareChainReducer = exports.chainDispatchActions = exports.chainDispatchActionsType = void 0;
const action_1 = require("../../../model/action");
const concept_1 = require("../../../model/concept");
exports.chainDispatchActionsType = 'dispatch Actions from Action Que via Payload to be Chained';
exports.chainDispatchActions = (0, action_1.prepareActionCreator)(exports.chainDispatchActionsType);
function prepareChainReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { actionQue: [
            ...state.actionQue,
            ...payload.actions
        ] });
}
exports.prepareChainReducer = prepareChainReducer;
exports.prepareChainQuality = (0, concept_1.createQuality)(exports.chainDispatchActionsType, prepareChainReducer);
