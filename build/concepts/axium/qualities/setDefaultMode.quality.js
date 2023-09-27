"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultModeQuality = exports.setDefaultModeReducer = exports.axiumSetDefaultModeType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
const axium_1 = require("../../../model/axium");
exports.axiumSetDefaultModeType = 'set Axium to its current Default Mode Index';
function setDefaultModeReducer(state, _action) {
    let methodSubscribers = state.methodSubscribers;
    methodSubscribers.forEach(named => named.subscriber.unsubscribe());
    methodSubscribers = [];
    const payload = _action.payload;
    const concepts = payload.concepts;
    concepts.forEach(concept => {
        concept.qualities.forEach(quality => {
            if (quality.method) {
                const sub = quality.method.subscribe(action => {
                    const action$ = state.action$;
                    (0, axium_1.defaultMethodSubscription)(action$, action);
                });
                methodSubscribers.push({
                    name: concept.name,
                    subscriber: sub
                });
            }
        });
    });
    return Object.assign(Object.assign({}, state), { modeIndex: state.defaultModeIndex, methodSubscribers });
}
exports.setDefaultModeReducer = setDefaultModeReducer;
exports.setDefaultModeQuality = (0, concept_2.createQuality)(exports.axiumSetDefaultModeType, setDefaultModeReducer, concept_1.createDefaultMethodCreator);
