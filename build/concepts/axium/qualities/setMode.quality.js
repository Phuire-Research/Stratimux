"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setModeQuality = exports.setModeReducer = exports.createOwnershipMethodCreator = exports.axiumSetModeType = void 0;
const action_1 = require("../../../model/action");
const concept_1 = require("../../../model/concept");
const rxjs_1 = require("rxjs");
const conclude_quality_1 = require("./conclude.quality");
const actionStrategy_1 = require("../../../model/actionStrategy");
exports.axiumSetModeType = 'set Axium Mode';
const createOwnershipMethodCreator = () => {
    const defaultSubject = new rxjs_1.Subject();
    const defaultMethod = defaultSubject.pipe((0, rxjs_1.map)((action) => {
        const payload = action.payload;
        if (action.strategy) {
            (0, actionStrategy_1.setDenoter)(action.strategy, `to ${payload.modeName}.`);
            return (0, actionStrategy_1.strategySuccess)(action.strategy);
        }
        return (0, action_1.createAction)(conclude_quality_1.axiumConcludeType);
    }));
    return [defaultMethod, defaultSubject];
};
exports.createOwnershipMethodCreator = createOwnershipMethodCreator;
function setModeReducer(state, _action) {
    const payload = _action.payload;
    return Object.assign(Object.assign({}, state), { modeIndex: [payload.modeIndex] });
}
exports.setModeReducer = setModeReducer;
exports.setModeQuality = (0, concept_1.createQuality)(exports.axiumSetModeType, setModeReducer, exports.createOwnershipMethodCreator);
