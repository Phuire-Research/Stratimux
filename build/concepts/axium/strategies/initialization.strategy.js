"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializationStrategy = exports.initializeTopic = void 0;
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const open_quality_1 = require("../qualities/open.quality");
const initializePrinciples_quality_1 = require("../qualities/initializePrinciples.quality");
const setDefaultMode_quality_1 = require("../qualities/setDefaultMode.quality");
const axium_concept_1 = require("../axium.concept");
exports.initializeTopic = 'Axium Initialization Strategy';
function initializationStrategy(concepts) {
    const initSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, initializePrinciples_quality_1.axiumInitializePrinciplesType);
    const setDefaultModeSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, setDefaultMode_quality_1.axiumSetDefaultModeType);
    const openSemaphore = (0, action_1.getSemaphore)(concepts, axium_concept_1.axiumName, open_quality_1.axiumOpenType);
    const stepThree = {
        actionType: open_quality_1.axiumOpenType,
        semaphore: openSemaphore,
        successNode: null,
        failureNode: null,
        payload: { concepts },
        preposition: 'Finally',
        denoter: 'to Notify Subscribers of State changes.'
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
        actionType: initializePrinciples_quality_1.axiumInitializePrinciplesType,
        semaphore: initSemaphore,
        successNode: stepTwo,
        failureNode: null,
        payload: { concepts },
        preposition: 'Begin with'
    };
    const params = {
        topic: exports.initializeTopic,
        initialNode: stepOne,
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.initializationStrategy = initializationStrategy;
