import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, strategyBegin, selectState } from '../../mod.ts';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept.ts';
import { addConceptsToRemovalQueThenBlockStrategy } from '../concepts/axium/strategies/removeConcept.strategy.ts';
import { log } from "../concepts/axium/qualities/log.quality.ts";
import { AxiumState } from "../concepts/axium/axium.concept.ts";

Deno.test("Axium Add Concepts Strategy Test", async () => {
    let count = 0;
    const axium = await createAxium([counterConcept]);
    console.log('Remove Concepts Begin');
    const sub = axium.subscribe((concepts: Concept[]) => {
        count++;
        // const counter = selectState<Counter>(concepts, counterConcept.key);
        console.log(`${count}: Loaded Concepts: ${concepts.length}`);
        if(count === 1) {
            axium.dispatch(
                strategyBegin(
                    addConceptsToRemovalQueThenBlockStrategy(concepts,[counterConcept])
                )
            )
        }
        if(count === 2) {
            let exists = false;
            concepts.forEach(concept => {
                if(concept.key === counterConcept.key) {
                    exists = true;
                }
            })
            assertEquals(false, exists);
        }
            // sub.unsubscribe();
    });
    
})