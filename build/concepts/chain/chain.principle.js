"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainPrinciple = void 0;
const action_1 = require("../../model/action");
const chain_concept_1 = require("./chain.concept");
const selector_1 = require("../../model/selector");
const registerSubscriber_quality_1 = require("../axium/qualities/registerSubscriber.quality");
const chainPrinciple = (observer, _concepts, concepts$) => {
    // let pass = true;
    // setInterval(() => {
    //     pass = true;
    // }, 50);
    const subscriber = concepts$.subscribe((concepts) => {
        var _a;
        const chainState = (0, selector_1.selectState)(concepts, chain_concept_1.chainName);
        if (chainState.actionQue.length > 0) {
            // pass = false;
            const newActionQue = [...chainState.actionQue];
            const nextAction = newActionQue.pop();
            chainState.actionQue = newActionQue;
            concepts$.next(concepts);
            const axiumState = concepts[0].state;
            (_a = axiumState.action$) === null || _a === void 0 ? void 0 : _a.next(nextAction);
        }
    });
    const primedRegisterSubscriber = (0, action_1.primeAction)(_concepts, (0, action_1.createAction)(registerSubscriber_quality_1.axiumRegisterSubscriberType));
    primedRegisterSubscriber.payload = {
        subscriber,
        name: chain_concept_1.chainName,
    };
    observer.next(primedRegisterSubscriber);
};
exports.chainPrinciple = chainPrinciple;
