/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the base selector consumer functions are working as intended.
$>*/
/*<#*/
import { muxification  } from '../model/muxium/muxium';
import { Concept, Concepts } from '../model/concept/concept';
import { select, selectPayload, selectSlice, selectState } from '../model/selectors/selector';
import { CounterState, createCounterConcept, counterName  } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';
import { CounterSetCountPayload, counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';

test('Muxium Selector Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as CounterState;
  counterState.count = 10;
  const muxium = muxification('muxiumSelectorTest', {counter}, {logging: true, storeDialog: true});
  const sub = muxium.subscribe((concepts: Concepts) => {
    const state = selectState<CounterState>(concepts, counterName);
    console.log('CHECK COUNT', state?.count);
    expect(state?.count).toBe(10);
    done();
    sub.unsubscribe();
  });
});

test('Muxium Selector State Slice Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as CounterState;
  counterState.count = 10;
  const muxium = muxification('muxiumSelectorStateSlicedTest', {counter}, {logging: true, storeDialog: true});
  muxium.subscribe((concepts: Concepts) => {
    const count = selectSlice<number>(concepts, counterSelectCount);
    expect(count).toBe(10);
    setTimeout(() => {done();}, 500);
  });
});

test('Muxium Selector Payload Test', (done) => {
  // For testing purposes only, access actionCreators via the Deck Interface in production.
  const setCount = counterSetCount.actionCreator({newCount: 10 });
  const payload = selectPayload<CounterSetCountPayload>(setCount);
  expect(payload.newCount).toBe(10);
  done();
});

test('Muxium Muxified Selector Test', (done) => {
  type SomeDeepObject = {
    something : {
      somethingElse: string,
      somethingArray: string[]
    },
    else: boolean[]
  }
  type DeepNested = {
    anything : SomeDeepObject,
    bool: boolean
  }
  const obj: DeepNested = {
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
    0: experiment as Concept<any>
  };
  const selector = select.createMuxifiedKeyedSelector<DeepNested>(concepts, 0, 'anything.something.somethingArray', [10, 9, 8, 7]);
  const conceptSelector = select.createConceptKeyedSelector<DeepNested>(experimentName, 'anything.something.somethingElse');
  if (selector) {
    const slices = select.set<string[]>(concepts, selector);
    console.log('CHECK SLICES', slices);
    if (slices) {
      expect(slices[0]).toBe('10');
      expect(slices[1]).toBe('9');
      expect(slices[2]).toBe('8');
      expect(slices[3]).toBe('7');
      expect(select.slice(concepts, conceptSelector)).toBe(obj.anything.something.somethingElse);
      done();
    }
  }
});

test('Muxium Deck Selector Test', (done) => {
  const ax = muxification('Test Base Selectors', {});
  ax.plan('Test Base Selectors', ({stageO, stage, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({k, e, stagePlanner}) => {
      stagePlanner.conclude();
      ax.close();
      done();
    })
  ]);
});

/*#>*/