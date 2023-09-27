"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownershipPrinciple = void 0;
const ownership_concept_1 = require("../ownership/ownership.concept");
const setOwnerShipMode_strategy_1 = require("./strategies/setOwnerShipMode.strategy");
const axium_concept_1 = require("../axium/axium.concept");
const selector_1 = require("../../model/selector");
const actionStrategy_1 = require("../../model/actionStrategy");
const principle_1 = require("../../model/principle");
const ownership_1 = require("../../model/ownership");
const ownershipPrinciple = (observer, _concepts, concepts$) => {
    let initDispatch = false;
    const sub = concepts$.subscribe(_cpts => {
        const axiumState = (0, selector_1.selectState)(_cpts, axium_concept_1.axiumName);
        if (axiumState.open) {
            const subscription = concepts$.subscribe(cpts => {
                let concepts = cpts;
                let ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
                if (ownershipState.initialized) {
                    // This will be the point of dispatch of Qued Actions
                    if (ownershipState.pendingActions) {
                        let newAction;
                        // One Action at a Time
                        for (const [i, action] of ownershipState.pendingActions.entries()) {
                            [concepts, newAction] = (0, ownership_1.isActionReady)(concepts, action);
                            if (newAction) {
                                ownershipState = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
                                ownershipState.pendingActions = ownershipState.pendingActions.filter((_, indx) => {
                                    return i !== indx;
                                });
                                break;
                            }
                        }
                        if (newAction) {
                            concepts$.next(concepts);
                            observer.next(newAction);
                        }
                    }
                }
                else if (!initDispatch && !ownershipState.initialized && ownershipState.isResponsibleForMode) {
                    initDispatch = true;
                    observer.next((0, actionStrategy_1.strategyBegin)((0, setOwnerShipMode_strategy_1.setOwnershipModeStrategy)(concepts, 'Ownership')));
                }
            });
            sub.unsubscribe();
            (0, principle_1.registerPrincipleSubscription)(observer, _cpts, ownership_concept_1.ownershipName, subscription);
        }
    });
};
exports.ownershipPrinciple = ownershipPrinciple;
