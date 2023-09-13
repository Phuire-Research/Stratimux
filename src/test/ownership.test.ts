import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectState } from '../model/selector';
import { OwnershipState, createOwnershipConcept, ownershipKey } from '../concepts/ownership/ownership.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { setOwnerShipModeTopic, setOwnershipModeStrategy } from '../concepts/ownership/strategies/setOwnerShipMode.strategy';

// REFACTOR to have two Axiums interact with One Another
// Going to Punt for now. Moving back towards creating the UI
// As this system is Reserved for a Complex Set Up and the Interaction
//  And the Interaction with the File System by default is that Set Up
// When this becomes important again. The requirement for a FailureNode to be that of Null
// Kicks in. As a Block of a Key is a Failure by Default
test('Ownership Test', (done) => {
  const axium = createAxium([createOwnershipConcept()], true, true);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<OwnershipState>(concepts, ownershipKey);
    const axiumState = concepts[0].state as AxiumState;
    if (state.initialized && axiumState.lastStrategy === setOwnerShipModeTopic) {
      expect(state.initialized).toBe(true);
      setTimeout(() => {done();}, 500);
      sub.unsubscribe();
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