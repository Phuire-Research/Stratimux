"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const actionStrategy_1 = require("../model/actionStrategy");
const selector_1 = require("../model/selector");
const counter_concept_1 = require("../concepts/counter/counter.concept");
const addConcept_strategy_1 = require("../concepts/axium/strategies/addConcept.strategy");
const counting_strategy_1 = require("../concepts/counter/strategies/counting.strategy");
test('Axium add Concepts Strategy Test', (done) => {
    const axium = (0, axium_1.createAxium)([], true, true);
    const staged = axium.stage('Add Concepts Stage', [
        (concepts, dispatch) => {
            dispatch((0, actionStrategy_1.strategyBegin)((0, addConcept_strategy_1.addConceptsToAddQueThenBlockStrategy)(concepts, [(0, counter_concept_1.createCounterConcept)()])), {
                iterateStep: true
            });
        },
        (concepts, dispatch) => {
            let exists = false;
            if (concepts[1].name === counter_concept_1.counterName) {
                exists = true;
                dispatch((0, actionStrategy_1.strategyBegin)((0, counter_concept_1.countingStrategy)()), {
                    iterateStep: true
                });
            }
            expect(exists).toBe(true);
        },
        (concepts) => {
            const axiumState = concepts[0].state;
            if (axiumState.lastStrategy === counting_strategy_1.countingTopic) {
                const counter = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
                expect(counter.count).toBe(1);
                setTimeout(() => { done(); }, 500);
                staged.close();
            }
        }
    ]);
});
