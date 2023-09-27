"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChainConcept = exports.chainName = void 0;
const concept_1 = require("../../model/concept");
const chain_principle_1 = require("./chain.principle");
const prepareChain_quality_1 = require("./qualities/prepareChain.quality");
exports.chainName = 'Chain';
const initialChainState = {
    actionQue: [],
};
const createChainConcept = () => {
    return (0, concept_1.createConcept)(exports.chainName, initialChainState, [prepareChain_quality_1.prepareChainQuality], [chain_principle_1.chainPrinciple]);
};
exports.createChainConcept = createChainConcept;
