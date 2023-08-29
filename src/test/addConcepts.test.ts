import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, strategyBegin, selectState } from '../../mod.ts';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept.ts';
import { addConceptsToAddQueThenBlockStrategy } from "../concepts/axium/strategies/addConcept.strategy.ts";
import { log } from "../concepts/axium/qualities/log.quality.ts";
import { AxiumState } from "../concepts/axium/axium.concept.ts";

Deno.test("Axium Add Concepts Strategy Test", async () => {
    let count = 0;
    const axium = await createAxium([]);
    console.log('Add Concepts Begin');
    const sub = axium.subscribe((concepts: Concept[]) => {
        count++;
        // const counter = selectState<Counter>(concepts, counterConcept.key);
        console.log(`${count}: Loaded Concepts: ${concepts.length}`);
        if(count === 1) {
            axium.dispatch(
                strategyBegin(
                    addConceptsToAddQueThenBlockStrategy(concepts,[counterConcept])
                )
            )
        }
        if(count === 2) {
            let exists = false;
            if (concepts[1].key === counterConcept.key) {
                exists = true;
                axium.dispatch(strategyBegin(countingStrategy()));
            }
            assertEquals(true, exists);
            // sub.unsubscribe();
        }
        if(count > 2) {
            const counter = selectState<Counter>(concepts, counterConcept.key);
            console.log('Counter: ', counter.count);
        }
        if(count === 7) {
            const counter = selectState<Counter>(concepts, counterConcept.key);
            assertEquals(1, counter.count);
        }
    });
    
})