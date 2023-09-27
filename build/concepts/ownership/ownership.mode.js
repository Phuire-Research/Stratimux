"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownershipMode = void 0;
const axium_mode_1 = require("../axium/axium.mode");
const setBlockingMode_quality_1 = require("../axium/qualities/setBlockingMode.quality");
const ownership_1 = require("../../model/ownership");
const conclude_quality_1 = require("../axium/qualities/conclude.quality");
const actionStrategy_1 = require("../../model/actionStrategy");
const ownershipMode = ([_action, _concepts, action$, concepts$]) => {
    let action = _action;
    let concepts = _concepts;
    let finalMode = axium_mode_1.permissiveMode;
    if (action.type === setBlockingMode_quality_1.axiumSetBlockingModeType) {
        finalMode = axium_mode_1.blockingMode;
    }
    // Clear previous Action from Strategy
    if (action.strategy && action.strategy.lastActionNode.action) {
        const lastAction = action.strategy.lastActionNode.action;
        if (lastAction.stubs) {
            // Clear Stubs
            concepts = (0, ownership_1.clearStubs)(concepts, lastAction);
        }
    }
    if (action.type !== conclude_quality_1.axiumConcludeType) {
        // Check In Logic
        const shouldBlock = (0, ownership_1.ownershipShouldBlock)(concepts, action);
        // Quality Opted in Action
        if (shouldBlock && !action.keyedSelectors) {
            // Principle is then responsible to dispatch these actions;
            concepts = (0, ownership_1.updateAddToPendingActions)(concepts, action);
            concepts$.next(concepts);
            // Action that would take Ownership and is Blocked
        }
        else if (shouldBlock && action.keyedSelectors) {
            if (action.strategy) {
                if (action.strategy.currentNode.failureNode !== null) {
                    // This assumes that the Strategy does not account for the Block
                    finalMode([(0, actionStrategy_1.strategyFailed)(action.strategy), concepts, action$, concepts$]);
                }
                else {
                    // This assumes that the Strategy is accounting for the Block
                    concepts = (0, ownership_1.updateAddToPendingActions)(concepts, (0, actionStrategy_1.strategyFailed)(action.strategy));
                    concepts$.next(concepts);
                }
            }
            else {
                // Principle is then responsible to dispatch these actions;
                concepts = (0, ownership_1.updateAddToPendingActions)(concepts, action);
                concepts$.next(concepts);
            }
            // Action that would take Ownership but is Free
        }
        else if (action.keyedSelectors) {
            [concepts, action] = (0, ownership_1.checkIn)(concepts, action);
            finalMode([action, concepts, action$, concepts$]);
        }
        else {
            // Free to Run
            finalMode([action, concepts, action$, concepts$]);
        }
    }
    else {
        finalMode([action, concepts, action$, concepts$]);
    }
};
exports.ownershipMode = ownershipMode;
