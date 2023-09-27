"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAxiumConcept = exports.axiumName = exports.initializationStrategy = void 0;
const rxjs_1 = require("rxjs");
const axium_principle_1 = require("./axium.principle");
const axium_mode_1 = require("./axium.mode");
const open_quality_1 = require("./qualities/open.quality");
const badAction_quality_1 = require("./qualities/badAction.quality");
const close_quality_1 = require("./qualities/close.quality");
const log_quality_1 = require("./qualities/log.quality");
const registerSubscriber_quality_1 = require("./qualities/registerSubscriber.quality");
const initializePrinciples_quality_1 = require("./qualities/initializePrinciples.quality");
var initialization_strategy_1 = require("./strategies/initialization.strategy");
Object.defineProperty(exports, "initializationStrategy", { enumerable: true, get: function () { return initialization_strategy_1.initializationStrategy; } });
const setBlockingMode_quality_1 = require("./qualities/setBlockingMode.quality");
const setDefaultMode_quality_1 = require("./qualities/setDefaultMode.quality");
const addConceptsFromQue_quality_1 = require("./qualities/addConceptsFromQue.quality");
const appendConceptsToAddQue_quality_1 = require("./qualities/appendConceptsToAddQue.quality");
const appendConceptsToRemoveQue_quality_1 = require("./qualities/appendConceptsToRemoveQue.quality");
const removeConceptsViaQue_quality_1 = require("./qualities/removeConceptsViaQue.quality");
const appendActionListToDialog_quality_1 = require("./qualities/appendActionListToDialog.quality");
const concept_1 = require("../../model/concept");
const setMode_quality_1 = require("./qualities/setMode.quality");
const setDefaultModeIndex_quality_1 = require("./qualities/setDefaultModeIndex.quality");
const clearDialog_quality_1 = require("./qualities/clearDialog.quality");
const unifiedSubject_1 = require("../../model/unifiedSubject");
exports.axiumName = 'axium';
const createAxiumState = (storeDialog, logging) => {
    return {
        open: false,
        logging: logging ? logging : false,
        dialog: '',
        storeDialog: storeDialog ? storeDialog : false,
        lastStrategy: '',
        generation: 0,
        cachedSemaphores: new Map(),
        modeIndex: 0,
        defaultModeIndex: 1,
        modeNames: [exports.axiumName, exports.axiumName],
        methodSubscribers: [],
        generalSubscribers: [],
        action$: new rxjs_1.Subject(),
        concepts$: new unifiedSubject_1.UnifiedSubject(),
        addConceptQue: [],
        removeConceptQue: [],
        subConcepts$: new unifiedSubject_1.UnifiedSubject(),
        badStages: []
    };
};
const createAxiumConcept = (storeDialog, logging) => {
    return (0, concept_1.createConcept)(exports.axiumName, createAxiumState(storeDialog, logging), [
        open_quality_1.openQuality,
        badAction_quality_1.badActionQuality,
        close_quality_1.closeQuality,
        appendActionListToDialog_quality_1.appendActionListToDialogQuality,
        clearDialog_quality_1.clearDialogQuality,
        log_quality_1.logQuality,
        registerSubscriber_quality_1.registerSubscriberQuality,
        initializePrinciples_quality_1.initializePrinciplesQuality,
        setBlockingMode_quality_1.setBlockingModeQuality,
        setDefaultMode_quality_1.setDefaultModeQuality,
        setDefaultModeIndex_quality_1.setDefaultModeIndexQuality,
        addConceptsFromQue_quality_1.addConceptsFromQueQuality,
        appendConceptsToAddQue_quality_1.appendConceptsToAddQueQuality,
        appendConceptsToRemoveQue_quality_1.appendConceptsToRemoveQueQuality,
        removeConceptsViaQue_quality_1.removeConceptsViaQueQuality,
        setMode_quality_1.setModeQuality
    ], [axium_principle_1.axiumPrinciple], [axium_mode_1.blockingMode, axium_mode_1.permissiveMode]);
};
exports.createAxiumConcept = createAxiumConcept;
