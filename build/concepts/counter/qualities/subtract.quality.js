"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtractQuality = exports.subtractReducer = exports.counterSubtract = exports.counterSubtractType = void 0;
const rxjs_1 = require("rxjs");
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_1 = require("../../../model/action");
const concept_1 = require("../../../model/concept");
const counter_selector_1 = require("../counter.selector");
const conclude_quality_1 = require("../../axium/qualities/conclude.quality");
exports.counterSubtractType = 'Counter Subtract';
exports.counterSubtract = (0, action_1.prepareActionCreator)(exports.counterSubtractType);
function subtractReducer(state) {
    return Object.assign(Object.assign({}, state), { count: state.count - 1 });
}
exports.subtractReducer = subtractReducer;
const subtractMethodCreator = () => {
    const subtractSubject = new rxjs_1.Subject();
    const subtractMethod = subtractSubject.pipe((0, rxjs_1.map)((action) => {
        if (action.strategy) {
            return (0, actionStrategy_1.strategySuccess)(action.strategy);
        }
        return (0, action_1.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [
        subtractMethod,
        subtractSubject
    ];
};
exports.subtractQuality = (0, concept_1.createQuality)(exports.counterSubtractType, subtractReducer, subtractMethodCreator, [counter_selector_1.counterSelectCount]);
