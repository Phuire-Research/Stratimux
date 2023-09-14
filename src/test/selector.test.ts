import { createAxium  } from '../model/axium';
import { Concept } from '../model/concept';
import { selectSlice, selectState } from '../model/selector';
import { Counter, createCounterConcept, counterName  } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';

test('Axium Selector Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as Counter;
  counterState.count = 10;
  const axium = createAxium([counter], true, true);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const state = selectState<Counter>(concepts, counterName);
    // const count = selectSlice<number>(concepts, counterSelectCount);
    expect(state.count).toBe(10);
    // expect(count).toBe(10);
    done();
  });
});

test('Axium Selector State Slice Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as Counter;
  counterState.count = 10;
  const axium = createAxium([counter], true, true);
  const sub = axium.subscribe((concepts: Concept[]) => {
    const count = selectSlice<number>(concepts, counterSelectCount);
    expect(count).toBe(10);
    // console.log('Check State Slice', 12);
    setTimeout(() => {done();}, 500);
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