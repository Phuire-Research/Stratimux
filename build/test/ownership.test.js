"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const selector_1 = require("../model/selector");
const ownership_concept_1 = require("../concepts/ownership/ownership.concept");
const setOwnerShipMode_strategy_1 = require("../concepts/ownership/strategies/setOwnerShipMode.strategy");
// REFACTOR
// Create a Test Ownership Principle
// And a Dummy set of Strategies that utilize default Method and Reducer
// Refine as you Go
test('Ownership Test', (done) => {
    const axium = (0, axium_1.createAxium)([(0, ownership_concept_1.createOwnershipConcept)()], true, true);
    const sub = axium.subscribe((concepts) => {
        const state = (0, selector_1.selectState)(concepts, ownership_concept_1.ownershipName);
        const axiumState = concepts[0].state;
        if (state.initialized && axiumState.lastStrategy === setOwnerShipMode_strategy_1.setOwnerShipModeTopic) {
            expect(state.initialized).toBe(true);
            setTimeout(() => { done(); }, 500);
            sub.unsubscribe();
        }
    });
});
// PUNT Additional Test: Have two Axiums interact with One Another
// Going to Punt for now. Moving back towards creating the UI
// As this system is Reserved for a Complex Set Up and the Interaction
//  And the Interaction with the File System by default is that Set Up
// When this becomes important again. The requirement for a FailureNode to be that of Null
// Kicks in. As a Block of a Key is a Failure by Default
