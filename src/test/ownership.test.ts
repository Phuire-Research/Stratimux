import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectState } from '../model/selector';
import { OwnershipState, createOwnershipConcept, ownershipKey } from '../concepts/ownership/ownership.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { setOwnerShipModeKey, setOwnershipModeStrategy } from '../concepts/ownership/strategies/setOwnerShipMode.strategy';

// REFACTOR to have two Axiums interact with One Another
// Play a Game of Tictac Toe
test('Ownership Test', (done) => {
  const axium = createAxium([createOwnershipConcept()]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<OwnershipState>(concepts, ownershipKey);
    const axiumState = concepts[0].state as AxiumState;
    if (state.initialized && axiumState.lastStrategy === setOwnerShipModeKey) {
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