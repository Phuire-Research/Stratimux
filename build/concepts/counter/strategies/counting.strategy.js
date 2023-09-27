"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.primedCountingStrategy = exports.primedCountingTopic = exports.countingStrategy = exports.countingTopic = void 0;
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const add_quality_1 = require("../qualities/add.quality");
const subtract_quality_1 = require("../qualities/subtract.quality");
const counter_concept_1 = require("../counter.concept");
exports.countingTopic = 'Counting Strategy';
function countingStrategy() {
    const stepFive = {
        actionType: subtract_quality_1.counterSubtractType,
        successNode: null,
        failureNode: null,
        preposition: 'and finally',
        denoter: 'One.',
    };
    const stepFour = {
        actionType: add_quality_1.counterAddType,
        successNode: stepFive,
        preposition: '',
        denoter: 'One;',
        failureNode: null,
    };
    const stepThree = {
        actionType: add_quality_1.counterAddType,
        successNode: stepFour,
        preposition: '',
        denoter: 'One;',
        failureNode: null,
    };
    const stepTwo = {
        actionType: subtract_quality_1.counterSubtractType,
        successNode: stepThree,
        preposition: '',
        denoter: 'One;',
        failureNode: null,
    };
    const stepOne = {
        actionType: add_quality_1.counterAddType,
        successNode: stepTwo,
        preposition: '',
        denoter: 'One;',
        failureNode: null,
    };
    const params = {
        topic: exports.countingTopic,
        initialNode: stepOne,
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.countingStrategy = countingStrategy;
exports.primedCountingTopic = 'Counting Strategy with Primed Actions';
function primedCountingStrategy(concepts) {
    const addSemaphore = (0, action_1.getSemaphore)(concepts, counter_concept_1.counterName, add_quality_1.counterAddType);
    const subtractSemaphore = (0, action_1.getSemaphore)(concepts, counter_concept_1.counterName, subtract_quality_1.counterSubtractType);
    const stepFour = {
        actionType: add_quality_1.counterAddType,
        semaphore: addSemaphore,
        successNode: null,
        failureNode: null,
        preposition: 'and finally',
        denoter: 'One.',
    };
    const stepThree = {
        actionType: add_quality_1.counterAddType,
        semaphore: addSemaphore,
        successNode: stepFour,
        failureNode: null,
        preposition: '',
        denoter: 'One;',
    };
    const stepTwo = {
        actionType: subtract_quality_1.counterSubtractType,
        semaphore: subtractSemaphore,
        successNode: stepThree,
        failureNode: null,
        preposition: '',
        denoter: 'One;',
    };
    const stepOne = {
        actionType: add_quality_1.counterAddType,
        semaphore: subtractSemaphore,
        successNode: stepTwo,
        failureNode: null,
        preposition: '',
        denoter: 'One;',
    };
    const params = {
        topic: exports.primedCountingTopic,
        initialNode: stepOne,
    };
    return (0, actionStrategy_1.createStrategy)(params);
}
exports.primedCountingStrategy = primedCountingStrategy;
