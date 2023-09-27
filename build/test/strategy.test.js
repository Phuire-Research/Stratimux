"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const actionStrategy_1 = require("../model/actionStrategy");
const selector_1 = require("../model/selector");
const counter_concept_1 = require("../concepts/counter/counter.concept");
const counting_strategy_1 = require("../concepts/counter/strategies/counting.strategy");
test('Axium Counting Strategy Test', (done) => {
    const axium = (0, axium_1.createAxium)([(0, counter_concept_1.createCounterConcept)()], true, true);
    const staged = axium.stage('Counting Strategy Stage', [
        (_, dispatch) => {
            dispatch((0, actionStrategy_1.strategyBegin)((0, counter_concept_1.countingStrategy)()), {
                iterateStep: true
            });
        }, (concepts) => {
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
