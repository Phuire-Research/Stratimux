import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectState } from '../model/selector';
import { Counter, counterConcept  } from '../concepts/counter/counter.concept';

test('Axium Selector Test', (done) => {
  const counter = counterConcept;
  const counterState = counterConcept.state as Counter;
  counterState.count = 10;
  const axium = createAxium([counter]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<Counter>(concepts, counter.key);
    expect(state.count).toBe(10);
    done();
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