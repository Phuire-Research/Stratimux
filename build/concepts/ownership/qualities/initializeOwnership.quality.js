"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOwnershipQuality = exports.initializeOwnershipReducer = exports.ownershipInitializeOwnershipType = void 0;
const concept_1 = require("../../../model/concept");
exports.ownershipInitializeOwnershipType = 'Ownership Initialize to True to enable Ownership Principle';
function initializeOwnershipReducer(state, action) {
    return Object.assign(Object.assign({}, state), { initialized: true });
}
exports.initializeOwnershipReducer = initializeOwnershipReducer;
exports.initializeOwnershipQuality = (0, concept_1.createQuality)(exports.ownershipInitializeOwnershipType, initializeOwnershipReducer, concept_1.defaultMethodCreator);
