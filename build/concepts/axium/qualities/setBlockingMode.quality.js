"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBlockingModeQuality = exports.setBlockingModeReducer = exports.axiumSetBlockingModeType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
const axium_1 = require("../../../model/axium");
exports.axiumSetBlockingModeType = 'set Axium to Blocking Mode';
function setBlockingModeReducer(state, _action) {
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
                    (0, axium_1.blockingMethodSubscription)(action$, action);
                });
                methodSubscribers.push({
                    name: concept.name,
                    subscriber: sub
                });
            }
        });
    });
    return Object.assign(Object.assign({}, state), { modeIndex: [0], methodSubscribers, open: false });
}
exports.setBlockingModeReducer = setBlockingModeReducer;
exports.setBlockingModeQuality = (0, concept_2.createQuality)(exports.axiumSetBlockingModeType, setBlockingModeReducer, concept_1.defaultMethodCreator);
