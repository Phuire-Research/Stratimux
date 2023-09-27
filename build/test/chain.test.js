"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axium_1 = require("../model/axium");
const action_1 = require("../model/action");
const selector_1 = require("../model/selector");
const counter_concept_1 = require("../concepts/counter/counter.concept");
const chain_concept_1 = require("../concepts/chain/chain.concept");
const prepareChain_quality_1 = require("../concepts/chain/qualities/prepareChain.quality");
const add_quality_1 = require("../concepts/counter/qualities/add.quality");
const subtract_quality_1 = require("../concepts/counter/qualities/subtract.quality");
test('Axium Test', (done) => {
    const axium = (0, axium_1.createAxium)([(0, counter_concept_1.createCounterConcept)(), (0, chain_concept_1.createChainConcept)()], true, true);
    // ax.subscribe(val=> console.log(val));
    // ax.subscribe(val => console.log('this value', val));
    let count = 0;
    let willDispatch = true;
    const sub = axium.subscribe((concepts) => {
        count++;
        if (willDispatch) {
            willDispatch = false;
            const primedAdd = (0, action_1.primeAction)(concepts, (0, add_quality_1.counterAdd)());
            const primedSubtract = (0, action_1.primeAction)(concepts, (0, subtract_quality_1.counterSubtract)());
            const primedPrepareChain = (0, action_1.primeAction)(concepts, (0, prepareChain_quality_1.chainDispatchActions)({
                actions: [
                    primedAdd,
                    primedAdd,
                    primedSubtract,
                    primedAdd,
                    primedSubtract,
                    primedAdd,
                ]
            }));
            axium.dispatch(primedPrepareChain);
        }
        else if (count === 7) {
            const counter = (0, selector_1.selectState)(concepts, counter_concept_1.counterName);
            expect(counter.count).toBe(2);
            setTimeout(() => { done(); }, 500);
            sub.unsubscribe();
        }
    });
});
