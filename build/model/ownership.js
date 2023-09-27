"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddToPendingActions = exports.areEqual = exports.isActionReady = exports.checkIn = exports.editStubs = exports.clearStubs = exports.ownershipShouldBlock = exports.createOwnershipLedger = void 0;
const action_1 = require("../model/action");
const ownership_concept_1 = require("../concepts/ownership/ownership.concept");
const selector_1 = require("./selector");
const badAction_quality_1 = require("../concepts/axium/qualities/badAction.quality");
const createOwnershipLedger = () => (new Map());
exports.createOwnershipLedger = createOwnershipLedger;
const ownershipShouldBlock = (concepts, action) => {
    const qualityKeys = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
    const actionSelectors = action.keyedSelectors;
    const ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
    const ownershipLedger = ownershipState.ownershipLedger;
    let shouldBlock = false;
    if (qualityKeys) {
        for (let i = 0; i < qualityKeys.length; i++) {
            if (ownershipLedger.has(`${qualityKeys[i].conceptName} ${qualityKeys[i].stateKeys}`)) {
                shouldBlock = true;
                break;
            }
        }
    }
    else if (actionSelectors) {
        for (let i = 0; i < actionSelectors.length; i++) {
            if (ownershipLedger.has(`${actionSelectors[i].conceptName} ${actionSelectors[i].stateKeys}`)) {
                shouldBlock = true;
                break;
            }
        }
    }
    return shouldBlock;
};
exports.ownershipShouldBlock = ownershipShouldBlock;
const clearStubs = (concepts, action) => {
    const newConcepts = concepts;
    const ownershipState = (0, selector_1.selectState)(newConcepts, ownership_concept_1.ownershipName);
    const ownershipLedger = ownershipState.ownershipLedger;
    if (action.stubs) {
        action.stubs.forEach(ticketStub => {
            const line = ownershipLedger.get(ticketStub.key);
            if (line) {
                const newLine = [];
                for (const stub of line) {
                    if (stub.ticket !== ticketStub.ticket) {
                        newLine.push(stub);
                    }
                }
                if (newLine.length === 0) {
                    ownershipLedger.delete(ticketStub.key);
                }
                else {
                    ownershipLedger.set(ticketStub.key, newLine);
                }
            }
        });
    }
    return newConcepts;
};
exports.clearStubs = clearStubs;
const editStubs = (_concepts, oldAction, newAction) => {
    const concepts = _concepts;
    newAction.stubs = [];
    const ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
    const ownershipLedger = ownershipState.ownershipLedger;
    if (oldAction.stubs) {
        oldAction.stubs.forEach((ticketStub) => {
            var _a;
            const line = ownershipLedger.get(ticketStub.key);
            if (line) {
                for (const stub of line) {
                    if (stub.ticket === ticketStub.ticket) {
                        stub.expiration = newAction.expiration;
                        (_a = newAction.stubs) === null || _a === void 0 ? void 0 : _a.push({
                            key: ticketStub.key,
                            ticket: stub.ticket
                        });
                    }
                }
            }
        });
    }
    return [concepts, newAction];
};
exports.editStubs = editStubs;
const checkIn = (concepts, action) => {
    var _a;
    const newConcepts = concepts;
    const ownershipState = (0, selector_1.selectState)(newConcepts, ownership_concept_1.ownershipName);
    const ownershipLedger = ownershipState.ownershipLedger;
    action.stubs = [];
    (_a = action.keyedSelectors) === null || _a === void 0 ? void 0 : _a.forEach(keyed => {
        var _a;
        const key = `${keyed.conceptName} ${keyed.stateKeys}`;
        const entry = ownershipLedger.get(key);
        const expiration = action.expiration;
        const newTicketStub = {
            key,
            ticket: ownershipState.ticker,
            expiration
        };
        const newTicket = {
            ticket: ownershipState.ticker,
            expiration
        };
        ownershipState.ticker += 1;
        (_a = action.stubs) === null || _a === void 0 ? void 0 : _a.push(newTicketStub);
        if (entry) {
            entry.push(newTicket);
        }
        else {
            ownershipLedger.set(key, [newTicket]);
        }
    });
    return [
        newConcepts,
        action
    ];
};
exports.checkIn = checkIn;
const isActionReady = (concepts, _action) => {
    if (_action.semaphore[2] !== -1 && _action.type !== badAction_quality_1.axiumBadActionType) {
        const action = _action;
        const stubs = action.stubs;
        if (stubs) {
            return stubAction(concepts, action);
        }
        else {
            return qualityAction(concepts, action);
        }
    }
    else if (_action.type !== badAction_quality_1.axiumBadActionType) {
        const action = (0, action_1.primeAction)(concepts, _action);
        return (0, exports.isActionReady)(concepts, action);
    }
    else {
        const ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
        const cleanUp = [];
        ownershipState.pendingActions = ownershipState.pendingActions.filter((atn) => {
            if (_action.type !== atn.type) {
                return true;
            }
            else {
                cleanUp.push(atn);
                return false;
            }
        });
        _action.payload = cleanUp;
        return [concepts, _action];
    }
};
exports.isActionReady = isActionReady;
const stubAction = (concepts, _action) => {
    const action = _action;
    const ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
    const ownershipLedger = ownershipState.ownershipLedger;
    const stubs = action.stubs;
    let frontOfAllLines = true;
    let expired = false;
    for (const stub of stubs) {
        if (action.expiration < Date.now()) {
            expired = true;
            break;
        }
        const positions = ownershipLedger.get(stub.key);
        if (positions) {
            for (const [i, pos] of positions.entries()) {
                if (i === 0 && pos.ticket === stub.ticket) {
                    break;
                }
                else {
                    frontOfAllLines = false;
                    break;
                }
            }
        }
    }
    if (expired) {
        for (const stub of stubs) {
            const positions = ownershipLedger.get(stub.key);
            if (positions) {
                const newLine = positions.filter(pos => pos.ticket !== stub.ticket);
                if (newLine.length > 0) {
                    ownershipLedger.set(stub.key, newLine);
                }
                else {
                    ownershipLedger.delete(stub.key);
                }
            }
        }
        return [concepts, (0, action_1.createAction)(badAction_quality_1.axiumBadActionType, action)];
    }
    if (frontOfAllLines) {
        for (const stub of stubs) {
            const line = ownershipLedger.get(stub.key);
            if (line) {
                const newLine = line;
                newLine.shift();
                if (newLine.length > 0) {
                    ownershipLedger.set(stub.key, newLine);
                }
                else {
                    ownershipLedger.delete(stub.key);
                }
            }
        }
        return [concepts, action];
    }
    else {
        return [concepts, undefined];
    }
};
const qualityAction = (concepts, _action) => {
    const ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
    const ownershipLedger = ownershipState.ownershipLedger;
    const action = _action;
    const qualitySelectors = concepts[action.semaphore[0]].qualities[action.semaphore[1]].keyedSelectors;
    let readyToGo = true;
    if (qualitySelectors) {
        for (const selector of qualitySelectors) {
            const key = `${selector.conceptName} ${selector.stateKeys}`;
            if (ownershipLedger.get(key)) {
                readyToGo = false;
                break;
            }
        }
        if (readyToGo) {
            return [concepts, action];
        }
    }
    return [concepts, undefined];
};
const areEqual = (first, second) => {
    // Really dumb compare, if and when this becomes a bottleneck, have Fun!
    return JSON.stringify(first) === JSON.stringify(second);
};
exports.areEqual = areEqual;
const updateAddToPendingActions = (_concepts, _action) => {
    let concepts = _concepts;
    let action = _action;
    const ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
    const pendingActions = ownershipState.pendingActions;
    const newPendingActions = [];
    const strippedAction = Object.assign(Object.assign({}, action), { expiration: 0 });
    for (const pending of pendingActions) {
        let found = false;
        const strippedPending = Object.assign(Object.assign({}, pending), { expiration: 0 });
        const equal = (0, exports.areEqual)(strippedAction, strippedPending);
        if (equal && pending.keyedSelectors) {
            [concepts, action] = (0, exports.editStubs)(concepts, pending, action);
            newPendingActions.push(action);
            found = true;
        }
        else if (equal) {
            newPendingActions.push(action);
        }
        else {
            newPendingActions.push(pending);
        }
        if (!found) {
            pendingActions.push(action);
        }
    }
    ownershipState.pendingActions = [...newPendingActions, action];
    return concepts;
};
exports.updateAddToPendingActions = updateAddToPendingActions;
