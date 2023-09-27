"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSubscriberQuality = exports.registerSubscriberReducer = exports.axiumRegisterSubscriberType = void 0;
const concept_1 = require("../../../model/concept");
const concept_2 = require("../../../model/concept");
exports.axiumRegisterSubscriberType = 'register Subscriber to Axium\'s General Subscriber list';
function registerSubscriberReducer(state, action) {
    const payload = action.payload;
    const generalSubscribers = state.generalSubscribers;
    const subscriber = payload.subscriber;
    const name = payload.name;
    generalSubscribers.push({ name, subscriber });
    return Object.assign(Object.assign({}, state), { generalSubscribers });
}
exports.registerSubscriberReducer = registerSubscriberReducer;
exports.registerSubscriberQuality = (0, concept_2.createQuality)(exports.axiumRegisterSubscriberType, registerSubscriberReducer, concept_1.createDefaultMethodCreator);
