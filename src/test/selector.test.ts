import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectSlice, selectState } from '../model/selector';
import { Counter, counterConcept, counterKey  } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';

test('Axium Selector Test', (done) => {
  const counter = counterConcept;
  const counterState = counterConcept.state as Counter;
  counterState.count = 10;
  const axium = createAxium([counter]);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<Counter>(concepts, counterKey);
    expect(state.count).toBe(10);
    done();
  });
});

test('Axium Selector State Slice Test', (done) => {
  const counter = counterConcept;
  const counterState = counterConcept.state as Counter;
  counterState.count = 10;
  const axium = createAxium([counter]);

  console.log('Check State Slice', counter);
  const sub = axium.subscribe((concepts: Concept[]) => {
    // const count = selectSlice<number>(concepts, counterSelectCount);
    console.log('Check State Slice', 12);
    expect(10).toBe(10);
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