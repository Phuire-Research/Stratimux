"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutQuality = exports.ownershipCheckoutType = void 0;
const concept_1 = require("../../../model/concept");
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const concept_2 = require("../../../model/concept");
const rxjs_1 = require("rxjs");
const conclude_quality_1 = require("../../axium/qualities/conclude.quality");
exports.ownershipCheckoutType = 'Ownership Checkout';
// Move Ticket Logic Creation to Mode Intersect for Checkout Strategy
const checkoutMethodCreator = () => {
    const addSubject = new rxjs_1.Subject();
    const addMethod = addSubject.pipe((0, rxjs_1.map)((action) => {
        if (action.strategy && action.keyedSelectors) {
            return (0, actionStrategy_1.strategySuccess)(action.strategy);
        }
        else if (action.strategy) {
            return (0, actionStrategy_1.strategyFailed)(action.strategy);
        }
        return (0, action_1.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [
        addMethod,
        addSubject
    ];
};
exports.checkoutQuality = (0, concept_2.createQuality)(exports.ownershipCheckoutType, concept_1.defaultReducer, checkoutMethodCreator);
