"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPrincipleSubscription = exports.createPrinciple$ = void 0;
const rxjs_1 = require("rxjs");
const action_1 = require("./action");
const registerSubscriber_quality_1 = require("../concepts/axium/qualities/registerSubscriber.quality");
function createPrinciple$(principleFunc, concepts, concepts$) {
    return new rxjs_1.Observable(function (obs) {
        principleFunc(obs, concepts, concepts$);
    });
}
exports.createPrinciple$ = createPrinciple$;
function registerPrincipleSubscription(observer, concepts, name, subscriber) {
    const primedRegisterSubscriber = (0, action_1.primeAction)(concepts, (0, action_1.createAction)(registerSubscriber_quality_1.axiumRegisterSubscriberType));
    primedRegisterSubscriber.payload = { subscriber, name };
    observer.next(primedRegisterSubscriber);
}
exports.registerPrincipleSubscription = registerPrincipleSubscription;
