"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const actionStrategy_1 = require("../model/actionStrategy");
const counter_concept_1 = require("../concepts/counter/counter.concept");
const removeConcept_strategy_1 = require("../concepts/axium/strategies/removeConcept.strategy");
test('Axium remove Concepts Strategy Test', (done) => {
    const axium = (0, axium_1.createAxium)([(0, counter_concept_1.createCounterConcept)()], true, true);
    const staged = axium.stage('Remove Concepts Stage', [
        (concepts, dispatch) => {
            dispatch((0, actionStrategy_1.strategyBegin)((0, removeConcept_strategy_1.addConceptsToRemovalQueThenBlockStrategy)(concepts, [(0, counter_concept_1.createCounterConcept)()])), {
                iterateStep: true
            });
        },
        (concepts) => {
            const axiumState = concepts[0].state;
            // console.log(concepts);
            if (axiumState.lastStrategy === removeConcept_strategy_1.removeConceptsViaQueThenUnblockTopic) {
                let exists = false;
                concepts.forEach(concept => {
                    if (concept.name === counter_concept_1.counterName) {
                        exists = true;
                    }
                });
                expect(exists).toBe(false);
                setTimeout(() => { done(); }, 500);
                staged.close();
            }
        }
    ]);
});
