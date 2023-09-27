"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConceptsFromQueThenUnblockStrategy = exports.addConceptsFromQueThenUnblockTopic = exports.addConceptsToAddQueThenBlockStrategy = exports.addConceptsToAddQueThenBlockTopic = void 0;
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const addConceptsFromQue_quality_1 = require("../qualities/addConceptsFromQue.quality");
const appendConceptsToAddQue_quality_1 = require("../qualities/appendConceptsToAddQue.quality");
const open_quality_1 = require("../qualities/open.quality");
const setBlockingMode_quality_1 = require("../qualities/setBlockingMode.quality");
const setDefaultMode_quality_1 = require("../qualities/setDefaultMode.quality");
const axium_concept_1 = require("../axium.concept");
// Step One to Add Concepts to Axium
exports.addConceptsToAddQueThenBlockTopic = 'Add Concepts to add que then set Axium Mode to Blocking';
function addConceptsToAddQueThenBlockStrategy(concepts, newConcepts) {
    const stepTwo = {
        actionType: appendConceptsToAddQue_quality_1.axiumAppendConceptsToAddQueType,
        successNode: null,
        failureNode: null,
        semaphore: (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, appendConceptsToAddQue_quality_1.axiumAppendConceptsToAddQueType),
        payload: { concepts: newConcepts },
        preposition: 'Then Safely'
    };
    const stepOne = {
        actionType: setBlockingMode_quality_1.axiumSetBlockingModeType,
        successNode: stepTwo,
        failureNode: null,
        semaphore: (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, setBlockingMode_quality_1.axiumSetBlockingModeType),
        payload: { concepts },
        preposition: 'Immediately'
    };
    const params = {
        topic: exports.addConceptsToAddQueThenBlockTopic,
        initialNode: stepOne
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.addConceptsToAddQueThenBlockStrategy = addConceptsToAddQueThenBlockStrategy;
// Step Two
exports.addConceptsFromQueThenUnblockTopic = 'Add Concepts from Que then set Axium Mode to Default';
function addConceptsFromQueThenUnblockStrategy(action$, conceptualSet) {
    const addConceptsFromQueSemaphore = (0, action_1.getSemaphore)(conceptualSet, axium_concept_1.axiumName, addConceptsFromQue_quality_1.axiumAddConceptFromQueType);
    const setDefaultModeSemaphore = (0, action_1.getSemaphore)(conceptualSet, axium_concept_1.axiumName, setDefaultMode_quality_1.axiumSetDefaultModeType);
    const openSemaphore = (0, action_1.getSemaphore)(conceptualSet, axium_concept_1.axiumName, open_quality_1.axiumOpenType);
    const stepThree = {
        actionType: open_quality_1.axiumOpenType,
        successNode: null,
        failureNode: null,
        semaphore: openSemaphore,
        preposition: 'Reinstate',
        denoter: 'State.'
    };
    const stepTwo = {
        actionType: setDefaultMode_quality_1.axiumSetDefaultModeType,
        semaphore: setDefaultModeSemaphore,
        successNode: stepThree,
        failureNode: null,
        payload: { concepts: conceptualSet },
        preposition: 'Then'
    };
    const stepOne = {
        actionType: addConceptsFromQue_quality_1.axiumAddConceptFromQueType,
        semaphore: addConceptsFromQueSemaphore,
        successNode: stepTwo,
        failureNode: null,
        payload: { action$ },
        preposition: 'First'
    };
    const params = {
        topic: exports.addConceptsFromQueThenUnblockTopic,
        initialNode: stepOne,
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.addConceptsFromQueThenUnblockStrategy = addConceptsFromQueThenUnblockStrategy;
