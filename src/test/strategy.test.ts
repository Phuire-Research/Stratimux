import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, strategyBegin, selectState } from '../../mod.ts';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept.ts';

Deno.test("Axium Counting Strategy Test", async () => {
    let count = 0;
    const axium = await createAxium([counterConcept]);
    const sub = axium.subscribe((concepts: Concept[]) => {
        count++;
        if(count ===  1) {
            axium.dispatch(strategyBegin(countingStrategy()));
        }
        const counter = selectState<Counter>(concepts, counterConcept.key);
        console.log(`Fires: ${count} Count: ${counter.count}`);
        if(count === 6) {
            console.log(`FINAL: Fires: ${count} Count: ${counter.count}`);
            assertEquals(counter.count, 1);
            sub.unsubscribe();
        }
    });
},
    // sanitizeResources: false,
    // sanitizeOps: false,
)