"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCountQuality = exports.setCountReducer = exports.counterSetCount = exports.counterSetCountType = void 0;
const concept_1 = require("../../../model/concept");
const action_1 = require("../../../model/action");
const concept_2 = require("../../../model/concept");
exports.counterSetCountType = 'Counter Chain Count';
exports.counterSetCount = (0, action_1.prepareActionCreator)(exports.counterSetCountType);
function setCountReducer(state, action) {
    const payload = action.payload;
    return Object.assign(Object.assign({}, state), { count: payload.newCount });
}
exports.setCountReducer = setCountReducer;
exports.setCountQuality = (0, concept_2.createQuality)(exports.counterSetCountType, concept_1.defaultReducer, concept_1.defaultMethodCreator);
