"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeConceptsViaQueThenUnblockStrategy = exports.removeConceptsViaQueThenUnblockTopic = exports.addConceptsToRemovalQueThenBlockStrategy = exports.addConceptsToRemovalQueThenBlockTopic = void 0;
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const removeConceptsViaQue_quality_1 = require("../qualities/removeConceptsViaQue.quality");
const appendConceptsToRemoveQue_quality_1 = require("../qualities/appendConceptsToRemoveQue.quality");
const setBlockingMode_quality_1 = require("../qualities/setBlockingMode.quality");
const open_quality_1 = require("../qualities/open.quality");
const setDefaultMode_quality_1 = require("../qualities/setDefaultMode.quality");
const axium_concept_1 = require("../axium.concept");
exports.addConceptsToRemovalQueThenBlockTopic = 'Add Concepts to removal Que then set Axium Mode to Blocking';
function addConceptsToRemovalQueThenBlockStrategy(concepts, targetConcepts) {
    const setBlockingModeSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, setBlockingMode_quality_1.axiumSetBlockingModeType);
    const appendConceptsToRemoveQueSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, appendConceptsToRemoveQue_quality_1.axiumAppendConceptsToRemoveQueType);
    const stepTwo = {
        actionType: appendConceptsToRemoveQue_quality_1.axiumAppendConceptsToRemoveQueType,
        semaphore: appendConceptsToRemoveQueSemaphore,
        successNode: null,
        failureNode: null,
        payload: { concepts: targetConcepts }
    };
    const stepOne = {
        actionType: setBlockingMode_quality_1.axiumSetBlockingModeType,
        semaphore: setBlockingModeSemaphore,
        successNode: stepTwo,
        failureNode: null,
        payload: { concepts }
    };
    const params = {
        topic: exports.addConceptsToRemovalQueThenBlockTopic,
        initialNode: stepOne
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.addConceptsToRemovalQueThenBlockStrategy = addConceptsToRemovalQueThenBlockStrategy;
// Step Two
exports.removeConceptsViaQueThenUnblockTopic = 'Remove Concepts via Que then set Axium Mode to Default';
function removeConceptsViaQueThenUnblockStrategy(concepts) {
    const removeConceptsViaQueSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, removeConceptsViaQue_quality_1.axiumRemoveConceptsViaQueType);
    const setDefaultModeSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, setDefaultMode_quality_1.axiumSetDefaultModeType);
    const openSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, open_quality_1.axiumOpenType);
    const stepThree = {
        actionType: open_quality_1.axiumOpenType,
        semaphore: openSemaphore,
        successNode: null,
        failureNode: null,
        preposition: 'Reinstate',
        denoter: 'State.'
    };
    const stepTwo = {
        actionType: setDefaultMode_quality_1.axiumSetDefaultModeType,
        semaphore: setDefaultModeSemaphore,
        successNode: stepThree,
        failureNode: null,
        payload: { concepts },
        preposition: 'Then'
    };
    const stepOne = {
        actionType: removeConceptsViaQue_quality_1.axiumRemoveConceptsViaQueType,
        semaphore: removeConceptsViaQueSemaphore,
        successNode: stepTwo,
        failureNode: null,
        preposition: 'To Begin'
    };
    const params = {
        topic: exports.removeConceptsViaQueThenUnblockTopic,
        initialNode: stepOne,
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.removeConceptsViaQueThenUnblockStrategy = removeConceptsViaQueThenUnblockStrategy;
