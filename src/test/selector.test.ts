import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createAxium, Concept, selectState } from '../../mod.ts';
import { Counter, counterConcept  } from '../concepts/counter/counter.concept.ts';

Deno.test( "Axium Selector Test", async () => {
    const counter = counterConcept;
    const counterState = counterConcept.state as Counter;
    counterState.count = 10;
    const axium = await createAxium([counter]);
    const sub = axium.subscribe((concepts: Concept[]) => {
        const state = selectState<Counter>(concepts, counter.key);
        console.log(`Count: ${state.count}`);
        assertEquals(state.count, 10);
    });
},
    // sanitizeResources: false,
    // sanitizeOps: false,
)