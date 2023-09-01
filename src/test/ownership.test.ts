import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectState } from '../model/selector';
import { OwnershipState, ownershipConcept } from '../concepts/ownership/ownership.concept';

test('Ownership Test', (done) => {
  const axium = createAxium([ownershipConcept]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<OwnershipState>(concepts, ownershipConcept.key);
    if (state.initialized) {
      expect(state.initialized).toBe(true);
      done();
    }
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