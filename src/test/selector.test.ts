import { createAxium  } from '../model/axium';
import { Concept, Concepts } from '../model/concept';
import { selectPayload, selectSlice, selectState } from '../model/selector';
import { Counter, createCounterConcept, counterName  } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';
import { SetCountPayload, counterSetCount } from '../concepts/counter/qualities/setCount.quality';

test('Axium Selector Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as Counter;
  counterState.count = 10;
  const axium = createAxium('axiumSelectorTest', [counter], true, true);
  const sub = axium.subscribe((concepts: Concepts) => {
    const state = selectState<Counter>(concepts, counterName);
    console.log('CHECK COUNT', state.count);
    expect(state.count).toBe(10);
    done();
  });
});

test('Axium Selector State Slice Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as Counter;
  counterState.count = 10;
  const axium = createAxium('axiumSelectorStateSlicedTest', [counter], true, true);
  const sub = axium.subscribe((concepts: Concepts) => {
    const count = selectSlice<number>(concepts, counterSelectCount);
    expect(count).toBe(10);
    setTimeout(() => {done();}, 500);
  });
});

test('Axium Selector Payload Test', (done) => {
  const setCount = counterSetCount({newCount: 10 });
  const payload = selectPayload<SetCountPayload>(setCount);
  expect(payload.newCount).toBe(10);
  done();
});
