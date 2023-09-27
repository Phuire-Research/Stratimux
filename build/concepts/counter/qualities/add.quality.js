"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuality = exports.addReducer = exports.counterAdd = exports.counterAddType = void 0;
const rxjs_1 = require("rxjs");
const action_1 = require("../../../model/action");
const actionStrategy_1 = require("../../../model/actionStrategy");
const action_2 = require("../../../model/action");
const concept_1 = require("../../../model/concept");
const counter_selector_1 = require("../counter.selector");
const conclude_quality_1 = require("../../axium/qualities/conclude.quality");
exports.counterAddType = 'Counter Add';
exports.counterAdd = (0, action_1.prepareActionCreator)(exports.counterAddType);
function addReducer(state, _) {
    return Object.assign(Object.assign({}, state), { count: state.count + 1 });
}
exports.addReducer = addReducer;
const addMethodCreator = () => {
    const addSubject = new rxjs_1.Subject();
    const addMethod = addSubject.pipe((0, rxjs_1.map)((action) => {
        if (action.strategy) {
            return (0, actionStrategy_1.strategySuccess)(action.strategy);
        }
        return (0, action_2.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [
        addMethod,
        addSubject
    ];
};
exports.addQuality = (0, concept_1.createQuality)(exports.counterAddType, addReducer, addMethodCreator, [counter_selector_1.counterSelectCount]);
