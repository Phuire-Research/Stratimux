import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, primeAction, selectState } from '../../mod.ts';
import { Counter, counterConcept, chainCount, add, subtract } from '../concepts/counter/counter.concept.ts';
import { chainConcept } from "../concepts/chain/chain.concept.ts";
import { PrepareChainPayload, prepareChain } from "../concepts/chain/qualities/prepareChain.quality.ts";

Deno.test("Axium Test", async () => {
    const axium = await createAxium([counterConcept, chainConcept]);
    // ax.subscribe(val=> console.log(val));
    // ax.subscribe(val => console.log('this value', val));
    let count = 0;
    const sub = axium.subscribe((concepts: Concept[]) => {
        count++;
        if(count === 1) {
            const primedPrepareChain = primeAction(concepts, prepareChain);
            const primedAdd = primeAction(concepts, add);
            const primedSubtract = primeAction(concepts, subtract);
            primedPrepareChain.payload = { 
                actions: [
                primedAdd,
                primedAdd,
                primedSubtract,
                primedAdd,
                primedSubtract,
                primedAdd,
            ]} as PrepareChainPayload;
            axium.dispatch(primedPrepareChain);
        } 
        else if (count === 7) {
            const counter = selectState<Counter>(concepts, counterConcept.key);
            assertEquals(counter.count, 2);
            sub.unsubscribe();
        }
    });
});
