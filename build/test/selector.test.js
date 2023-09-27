"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const selector_1 = require("../model/selector");
const counter_concept_1 = require("../concepts/counter/counter.concept");
const counter_selector_1 = require("../concepts/counter/counter.selector");
test('Axium Selector Test', (done) => {
    const counter = (0, counter_concept_1.createCounterConcept)();
    const counterState = counter.state;
    counterState.count = 10;
    const axium = (0, axium_1.createAxium)([counter], true, true);
    const sub = axium.subscribe((concepts) => {
        const state = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
        // const count = selectSlice<number>(concepts, counterSelectCount);
        expect(state.count).toBe(10);
        // expect(count).toBe(10);
        done();
    });
});
test('Axium Selector State Slice Test', (done) => {
    const counter = (0, counter_concept_1.createCounterConcept)();
    const counterState = counter.state;
    counterState.count = 10;
    const axium = (0, axium_1.createAxium)([counter], true, true);
    const sub = axium.subscribe((concepts) => {
        const count = (0, selector_1.selectSlice)(concepts, counter_selector_1.counterSelectCount);
        expect(count).toBe(10);
        // console.log('Check State Slice', 12);
        setTimeout(() => { done(); }, 500);
    });
});
// Deno.test( 'Axium Selector Test', async () => {
//   const counter = counterConcept;
//   const counterState = counterConcept.state as Counter;
//   counterState.count = 10;
//   const axium = await createAxium([counter]);
//   const sub = axium.subscribe((concepts: Concept[]) => {
//     const state = selectState<Counter>(concepts, counter.key);
//     console.log(`Count: ${state.count}`);
//     assertEquals(state.count, 10);
//   });
// },
//   // sanitizeResources: false,
//   // sanitizeOps: false,
// );
