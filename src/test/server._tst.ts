// import { createAxium, Concept, strategyBegin, selectState } from '../../mod.ts';
import { Counter, counterConcept, countingStrategy, primedCountingStrategy } from '../concepts/counter/counter.concept';
import { serverConcept } from '../concepts/server/server.concept';

// Deno.test("Axium Counting Strategy Test", async () => {
//     let count = -1;
//     const axium = await createAxium([counterConcept, serverConcept]);
//     const sub = axium.subscribe((concepts: Concept[]) => {
//         count++;
//         const counter = selectState<Counter>(concepts, counterConcept.key);
//         console.log(`Fires: ${count} Count: ${counter.count}`);
//         if(count === 5) {
//             console.log(`FINAL: Fires: ${count} Count: ${counter.count}`);
//             setTimeout(() => {
//                 sub.unsubscribe();
//                 assertEquals(1, 1);
//             }, 1000);
//         }
//     });
//     axium.dispatch(strategyBegin(countingStrategy()));
// },
//     // sanitizeResources: false,
//     // sanitizeOps: false,
// )