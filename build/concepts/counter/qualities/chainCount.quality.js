"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainCountQuality = exports.counterChainCount = exports.counterChainCountType = void 0;
const concept_1 = require("../../../model/concept");
const action_1 = require("../../../model/action");
const concept_2 = require("../../../model/concept");
exports.counterChainCountType = 'Counter Chain Count';
exports.counterChainCount = (0, action_1.prepareActionCreator)(exports.counterChainCountType);
exports.chainCountQuality = (0, concept_2.createQuality)(exports.counterChainCountType, concept_1.defaultReducer);
