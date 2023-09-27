"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOwnershipConcept = exports.ownershipName = void 0;
const concept_1 = require("../../model/concept");
const ownership_mode_1 = require("./ownership.mode");
const initializeOwnership_quality_1 = require("./qualities/initializeOwnership.quality");
const ownership_principle_1 = require("./ownership.principle");
const ownership_1 = require("../../model/ownership");
exports.ownershipName = 'ownership';
const createOwnershipState = (isResponsibleForMode) => {
    return {
        initialized: false,
        ownershipLedger: (0, ownership_1.createOwnershipLedger)(),
        pendingActions: [],
        ticker: 0,
        isResponsibleForMode
    };
};
const createOwnershipConcept = (isResponsibleForMode) => {
    return (0, concept_1.createConcept)(exports.ownershipName, createOwnershipState(isResponsibleForMode ? isResponsibleForMode : true), [
        initializeOwnership_quality_1.initializeOwnershipQuality
    ], [
        ownership_principle_1.ownershipPrinciple
    ], [ownership_mode_1.ownershipMode]);
};
exports.createOwnershipConcept = createOwnershipConcept;
