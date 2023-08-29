// TEMP
import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, strategyBegin, selectState } from './mod.ts';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from './src/concepts/counter/counter.concept.ts';
import { serverConcept } from './src/concepts/server/server.concept.ts';

let count = -1;
const axium = await createAxium([counterConcept, serverConcept]);
const sub = axium.subscribe((concepts: Concept[]) => {
    count++;
    const counter = selectState<Counter>(concepts, counterConcept.key);
    console.log(`Fires: ${count} Count: ${counter.count}`);
    if(count === 5) {
        console.log(`FINAL: Fires: ${count} Count: ${counter.count}`);
        setTimeout(() => {
            sub.unsubscribe();
            assertEquals(1, 1);
        }, 1000);
    }
});
axium.dispatch(strategyBegin(countingStrategy()));