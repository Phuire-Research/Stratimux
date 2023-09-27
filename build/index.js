"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterSetCountType = exports.counterSetCount = exports.counterSubtractType = exports.counterSubtract = exports.counterAddType = exports.counterAdd = exports.counterSelectCount = exports.createCounterConcept = exports.counterName = exports.addConceptsToRemovalQueThenBlockTopic = exports.addConceptsToRemovalQueThenBlockStrategy = exports.addConceptsToAddQueThenBlockTopic = exports.addConceptsToAddQueThenBlockStrategy = exports.axiumSetBlockingModeType = exports.axiumSetDefaultModeType = exports.axiumClearDialogType = exports.axiumClearDialog = exports.axiumSetDefaultModeIndexType = exports.axiumSetModeType = exports.axiumCloseType = exports.axiumClose = exports.axiumLogType = exports.axiumLog = exports.axiumOpenType = exports.axiumOpen = exports.axiumSelectOpen = exports.permissiveMode = exports.blockingMode = exports.createAxiumConcept = exports.axiumName = exports.selectSlice = exports.selectConcept = exports.selectState = exports.defaultMethodCreator = exports.defaultReducer = exports.createQuality = exports.createConcept = exports.prepareActionCreator = exports.getSemaphore = exports.createAction = exports.primeAction = exports.setDenoter = exports.setPreposition = exports.puntStrategy = exports.strategyDecide = exports.strategyFailed = exports.strategySuccess = exports.strategyBegin = exports.createStrategy = exports.createAxium = void 0;
exports.selectOwnershipLedger = exports.ownershipMode = exports.createOwnershipConcept = exports.ownershipName = exports.chainDispatchActionsType = exports.chainDispatchActions = exports.createChainConcept = exports.chainName = exports.primedCountingTopic = exports.primedCountingStrategy = exports.countingTopic = exports.countingStrategy = void 0;
var axium_1 = require("./model/axium");
Object.defineProperty(exports, "createAxium", { enumerable: true, get: function () { return axium_1.createAxium; } });
var actionStrategy_1 = require("./model/actionStrategy");
Object.defineProperty(exports, "createStrategy", { enumerable: true, get: function () { return actionStrategy_1.createStrategy; } });
Object.defineProperty(exports, "strategyBegin", { enumerable: true, get: function () { return actionStrategy_1.strategyBegin; } });
Object.defineProperty(exports, "strategySuccess", { enumerable: true, get: function () { return actionStrategy_1.strategySuccess; } });
Object.defineProperty(exports, "strategyFailed", { enumerable: true, get: function () { return actionStrategy_1.strategyFailed; } });
Object.defineProperty(exports, "strategyDecide", { enumerable: true, get: function () { return actionStrategy_1.strategyDecide; } });
Object.defineProperty(exports, "puntStrategy", { enumerable: true, get: function () { return actionStrategy_1.puntStrategy; } });
Object.defineProperty(exports, "setPreposition", { enumerable: true, get: function () { return actionStrategy_1.setPreposition; } });
Object.defineProperty(exports, "setDenoter", { enumerable: true, get: function () { return actionStrategy_1.setDenoter; } });
var action_1 = require("./model/action");
Object.defineProperty(exports, "primeAction", { enumerable: true, get: function () { return action_1.primeAction; } });
Object.defineProperty(exports, "createAction", { enumerable: true, get: function () { return action_1.createAction; } });
Object.defineProperty(exports, "getSemaphore", { enumerable: true, get: function () { return action_1.getSemaphore; } });
Object.defineProperty(exports, "prepareActionCreator", { enumerable: true, get: function () { return action_1.prepareActionCreator; } });
var concept_1 = require("./model/concept");
Object.defineProperty(exports, "createConcept", { enumerable: true, get: function () { return concept_1.createConcept; } });
Object.defineProperty(exports, "createQuality", { enumerable: true, get: function () { return concept_1.createQuality; } });
Object.defineProperty(exports, "defaultReducer", { enumerable: true, get: function () { return concept_1.defaultReducer; } });
Object.defineProperty(exports, "defaultMethodCreator", { enumerable: true, get: function () { return concept_1.defaultMethodCreator; } });
var selector_1 = require("./model/selector");
Object.defineProperty(exports, "selectState", { enumerable: true, get: function () { return selector_1.selectState; } });
Object.defineProperty(exports, "selectConcept", { enumerable: true, get: function () { return selector_1.selectConcept; } });
Object.defineProperty(exports, "selectSlice", { enumerable: true, get: function () { return selector_1.selectSlice; } });
//** Concept Exports */
// Axium
var axium_concept_1 = require("./concepts/axium/axium.concept");
Object.defineProperty(exports, "axiumName", { enumerable: true, get: function () { return axium_concept_1.axiumName; } });
Object.defineProperty(exports, "createAxiumConcept", { enumerable: true, get: function () { return axium_concept_1.createAxiumConcept; } });
var axium_mode_1 = require("./concepts/axium/axium.mode");
Object.defineProperty(exports, "blockingMode", { enumerable: true, get: function () { return axium_mode_1.blockingMode; } });
Object.defineProperty(exports, "permissiveMode", { enumerable: true, get: function () { return axium_mode_1.permissiveMode; } });
var axium_selector_1 = require("./concepts/axium/axium.selector");
Object.defineProperty(exports, "axiumSelectOpen", { enumerable: true, get: function () { return axium_selector_1.axiumSelectOpen; } });
// Qualities
var open_quality_1 = require("./concepts/axium/qualities/open.quality");
Object.defineProperty(exports, "axiumOpen", { enumerable: true, get: function () { return open_quality_1.axiumOpen; } });
Object.defineProperty(exports, "axiumOpenType", { enumerable: true, get: function () { return open_quality_1.axiumOpenType; } });
var log_quality_1 = require("./concepts/axium/qualities/log.quality");
Object.defineProperty(exports, "axiumLog", { enumerable: true, get: function () { return log_quality_1.axiumLog; } });
Object.defineProperty(exports, "axiumLogType", { enumerable: true, get: function () { return log_quality_1.axiumLogType; } });
var close_quality_1 = require("./concepts/axium/qualities/close.quality");
Object.defineProperty(exports, "axiumClose", { enumerable: true, get: function () { return close_quality_1.axiumClose; } });
Object.defineProperty(exports, "axiumCloseType", { enumerable: true, get: function () { return close_quality_1.axiumCloseType; } });
var setMode_quality_1 = require("./concepts/axium/qualities/setMode.quality");
Object.defineProperty(exports, "axiumSetModeType", { enumerable: true, get: function () { return setMode_quality_1.axiumSetModeType; } });
var setDefaultModeIndex_quality_1 = require("./concepts/axium/qualities/setDefaultModeIndex.quality");
Object.defineProperty(exports, "axiumSetDefaultModeIndexType", { enumerable: true, get: function () { return setDefaultModeIndex_quality_1.axiumSetDefaultModeIndexType; } });
var clearDialog_quality_1 = require("./concepts/axium/qualities/clearDialog.quality");
Object.defineProperty(exports, "axiumClearDialog", { enumerable: true, get: function () { return clearDialog_quality_1.axiumClearDialog; } });
Object.defineProperty(exports, "axiumClearDialogType", { enumerable: true, get: function () { return clearDialog_quality_1.axiumClearDialogType; } });
var setDefaultMode_quality_1 = require("./concepts/axium/qualities/setDefaultMode.quality");
Object.defineProperty(exports, "axiumSetDefaultModeType", { enumerable: true, get: function () { return setDefaultMode_quality_1.axiumSetDefaultModeType; } });
var setBlockingMode_quality_1 = require("./concepts/axium/qualities/setBlockingMode.quality");
Object.defineProperty(exports, "axiumSetBlockingModeType", { enumerable: true, get: function () { return setBlockingMode_quality_1.axiumSetBlockingModeType; } });
// Strategies
var addConcept_strategy_1 = require("./concepts/axium/strategies/addConcept.strategy");
Object.defineProperty(exports, "addConceptsToAddQueThenBlockStrategy", { enumerable: true, get: function () { return addConcept_strategy_1.addConceptsToAddQueThenBlockStrategy; } });
Object.defineProperty(exports, "addConceptsToAddQueThenBlockTopic", { enumerable: true, get: function () { return addConcept_strategy_1.addConceptsToAddQueThenBlockTopic; } });
var removeConcept_strategy_1 = require("./concepts/axium/strategies/removeConcept.strategy");
Object.defineProperty(exports, "addConceptsToRemovalQueThenBlockStrategy", { enumerable: true, get: function () { return removeConcept_strategy_1.addConceptsToRemovalQueThenBlockStrategy; } });
Object.defineProperty(exports, "addConceptsToRemovalQueThenBlockTopic", { enumerable: true, get: function () { return removeConcept_strategy_1.addConceptsToRemovalQueThenBlockTopic; } });
// Counter
var counter_concept_1 = require("./concepts/counter/counter.concept");
Object.defineProperty(exports, "counterName", { enumerable: true, get: function () { return counter_concept_1.counterName; } });
Object.defineProperty(exports, "createCounterConcept", { enumerable: true, get: function () { return counter_concept_1.createCounterConcept; } });
var counter_selector_1 = require("./concepts/counter/counter.selector");
Object.defineProperty(exports, "counterSelectCount", { enumerable: true, get: function () { return counter_selector_1.counterSelectCount; } });
// Qualities
var add_quality_1 = require("./concepts/counter/qualities/add.quality");
Object.defineProperty(exports, "counterAdd", { enumerable: true, get: function () { return add_quality_1.counterAdd; } });
Object.defineProperty(exports, "counterAddType", { enumerable: true, get: function () { return add_quality_1.counterAddType; } });
var subtract_quality_1 = require("./concepts/counter/qualities/subtract.quality");
Object.defineProperty(exports, "counterSubtract", { enumerable: true, get: function () { return subtract_quality_1.counterSubtract; } });
Object.defineProperty(exports, "counterSubtractType", { enumerable: true, get: function () { return subtract_quality_1.counterSubtractType; } });
var setCount_quality_1 = require("./concepts/counter/qualities/setCount.quality");
Object.defineProperty(exports, "counterSetCount", { enumerable: true, get: function () { return setCount_quality_1.counterSetCount; } });
Object.defineProperty(exports, "counterSetCountType", { enumerable: true, get: function () { return setCount_quality_1.counterSetCountType; } });
// Strategies
var counting_strategy_1 = require("./concepts/counter/strategies/counting.strategy");
Object.defineProperty(exports, "countingStrategy", { enumerable: true, get: function () { return counting_strategy_1.countingStrategy; } });
Object.defineProperty(exports, "countingTopic", { enumerable: true, get: function () { return counting_strategy_1.countingTopic; } });
Object.defineProperty(exports, "primedCountingStrategy", { enumerable: true, get: function () { return counting_strategy_1.primedCountingStrategy; } });
Object.defineProperty(exports, "primedCountingTopic", { enumerable: true, get: function () { return counting_strategy_1.primedCountingTopic; } });
// Chain
var chain_concept_1 = require("./concepts/chain/chain.concept");
Object.defineProperty(exports, "chainName", { enumerable: true, get: function () { return chain_concept_1.chainName; } });
Object.defineProperty(exports, "createChainConcept", { enumerable: true, get: function () { return chain_concept_1.createChainConcept; } });
// Qualities
var prepareChain_quality_1 = require("./concepts/chain/qualities/prepareChain.quality");
Object.defineProperty(exports, "chainDispatchActions", { enumerable: true, get: function () { return prepareChain_quality_1.chainDispatchActions; } });
Object.defineProperty(exports, "chainDispatchActionsType", { enumerable: true, get: function () { return prepareChain_quality_1.chainDispatchActionsType; } });
// Ownership
var ownership_concept_1 = require("./concepts/ownership/ownership.concept");
Object.defineProperty(exports, "ownershipName", { enumerable: true, get: function () { return ownership_concept_1.ownershipName; } });
Object.defineProperty(exports, "createOwnershipConcept", { enumerable: true, get: function () { return ownership_concept_1.createOwnershipConcept; } });
var ownership_mode_1 = require("./concepts/ownership/ownership.mode");
Object.defineProperty(exports, "ownershipMode", { enumerable: true, get: function () { return ownership_mode_1.ownershipMode; } });
var ownership_selector_1 = require("./concepts/ownership/ownership.selector");
Object.defineProperty(exports, "selectOwnershipLedger", { enumerable: true, get: function () { return ownership_selector_1.selectOwnershipLedger; } });
