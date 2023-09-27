"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const selector_1 = require("../model/selector");
const counter_concept_1 = require("../concepts/counter/counter.concept");
const add_quality_1 = require("../concepts/counter/qualities/add.quality");
const subtract_quality_1 = require("../concepts/counter/qualities/subtract.quality");
const counter_selector_1 = require("../concepts/counter/counter.selector");
test('Axium Stage Dispatch Options Test', (done) => {
    let runCount = 0;
    const axium = (0, axium_1.createAxium)([(0, counter_concept_1.createCounterConcept)()], true);
    axium.subscribe((concepts) => {
        const axiumState = concepts[0].state;
        if (axiumState.badStages.length > 0) {
            const badStage = axiumState.badStages[0];
            const counter = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
            console.log('Stage Ran Away, badStages.length: ', axiumState.badStages.length, 'Count: ', counter.count);
            expect(badStage.stepFailed).toBe(2);
            expect(counter.count).toBe(2);
            setTimeout(() => { done(); }, 500);
            staged.close();
        }
    });
    const staged = axium.stage('Stage DispatchOptions Test', [
        (concepts, dispatch) => {
            const counter = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
            console.log('Stage 1 ', counter, runCount);
            dispatch((0, add_quality_1.counterAdd)(), {
                iterateStep: true
            });
        }, (concepts, dispatch) => {
            runCount++;
            const counter = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
            console.log('Stage 2 ', counter, runCount);
            dispatch((0, add_quality_1.counterAdd)(), {
                runOnce: true
            });
            // if (counter.count === 2) {
            // console.log('Counter should be 2', counter.count);
            // expect(counter.count).toBe(2);
            dispatch((0, add_quality_1.counterAdd)(), {
                setStep: 2,
                // runOnce: true,
                debounce: 0,
                on: {
                    selector: counter_selector_1.counterSelectCount,
                    expected: 2
                }
            });
            // }
        }, (concepts, dispatch) => {
            runCount++;
            const counter = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
            console.log('Stage 3 ', counter, runCount);
            // Will cause the stage to close
            dispatch((0, subtract_quality_1.counterSubtract)(), {
            // Enabling will prevent close and cause this test to timeout
            // debounce: 500
            });
        }
    ]);
});
