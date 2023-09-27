"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOwnershipModeStrategy = exports.setOwnerShipModeTopic = void 0;
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const initializeOwnership_quality_1 = require("../qualities/initializeOwnership.quality");
const setMode_quality_1 = require("../../axium/qualities/setMode.quality");
const ownership_concept_1 = require("../ownership.concept");
const setDefaultModeIndex_quality_1 = require("../../axium/qualities/setDefaultModeIndex.quality");
exports.setOwnerShipModeTopic = 'Axium set Mode to Ownership then Initialize Ownership Principle';
function setOwnershipModeStrategy(concepts, modeName) {
    const initializeOwnershipSemaphore = (0, action_1.getSemaphore)(concepts, ownership_concept_1.ownershipName, initializeOwnership_quality_1.ownershipInitializeOwnershipType);
    const setModeSemaphore = (0, action_1.getSemaphore)(concepts, ownership_concept_1.ownershipName, setMode_quality_1.axiumSetModeType);
    const setDefaultModeIndexSemaphore = (0, action_1.getSemaphore)(concepts, ownership_concept_1.ownershipName, setDefaultModeIndex_quality_1.axiumSetDefaultModeIndexType);
    let ownershipModeIndex = 2;
    concepts[0].state.modeNames.forEach((key, i) => {
        if (key === ownership_concept_1.ownershipName) {
            ownershipModeIndex = i;
        }
    });
    const stepThree = {
        actionType: initializeOwnership_quality_1.ownershipInitializeOwnershipType,
        semaphore: initializeOwnershipSemaphore,
        successNode: null,
        failureNode: null,
        preposition: 'Set',
    };
    const stepTwo = {
        actionType: setMode_quality_1.axiumSetModeType,
        semaphore: setModeSemaphore,
        successNode: stepThree,
        failureNode: null,
        payload: { modeIndex: 2, modeName },
        preposition: 'Successfully'
    };
    const stepOne = {
        actionType: setDefaultModeIndex_quality_1.axiumSetDefaultModeIndexType,
        semaphore: setDefaultModeIndexSemaphore,
        successNode: stepTwo,
        failureNode: null,
        payload: { index: ownershipModeIndex },
        preposition: 'Successfully'
    };
    const params = {
        topic: exports.setOwnerShipModeTopic,
        initialNode: stepOne,
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.setOwnershipModeStrategy = setOwnershipModeStrategy;
