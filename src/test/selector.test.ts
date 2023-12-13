/*<$
For the graph programming framework Stratimux, generate a test to ensure that the base selector consumer functions are working as intended.
$>*/
/*<#*/
import { createAxium  } from '../model/axium';
import { Concepts } from '../model/concept';
import { createUnifiedKeyedSelector, selectPayload, selectSlice, selectState } from '../model/selector';
import { CounterState, createCounterConcept, counterName  } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';
import { CounterSetCountPayload, counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { AxiumState } from '../concepts/axium/axium.concept';
import { createExperimentConcept } from '../concepts/experiment/experiment.concept';

test('Axium Selector Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as CounterState;
  counterState.count = 10;
  const axium = createAxium('axiumSelectorTest', [counter], true, true);
  axium.subscribe((concepts: Concepts) => {
    const state = selectState<CounterState>(concepts, counterName);
    console.log('CHECK COUNT', state?.count);
    expect(state?.count).toBe(10);
    done();
  });
});

test('Axium Selector State Slice Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as CounterState;
  counterState.count = 10;
  const axium = createAxium('axiumSelectorStateSlicedTest', [counter], true, true);
  axium.subscribe((concepts: Concepts) => {
    const count = selectSlice<number>(concepts, counterSelectCount);
    expect(count).toBe(10);
    setTimeout(() => {done();}, 500);
  });
});

test('Axium Selector Payload Test', (done) => {
  const setCount = counterSetCount({newCount: 10 });
  const payload = selectPayload<CounterSetCountPayload>(setCount);
  expect(payload.newCount).toBe(10);
  done();
});

test('Axium Unified Selector Test', (done) => {
  type SomeDeepObject = {
    something : {
      somethingElse: string,
      somethingArray: string[]
    },
    else: boolean[]
  }
  type Deeper = {
    anything : SomeDeepObject,
    bool: boolean
  }
  const obj: Deeper = {
    anything: {
      else: [false],
      something: {
        somethingArray: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        somethingElse: 'somethingElse'
      }
    },
    bool: true
  };
  const experiment = createExperimentConcept(obj);
  const concepts: Concepts = {
    0: experiment
  };
  const selector = createUnifiedKeyedSelector<Deeper>(experiment, 0, 'anything.something.somethingArray', 10);
  if (selector) {
    const slice = selectSlice<string>(concepts, selector);
    expect(slice).toBe('10');
    done();
  }
});
/*#>*/