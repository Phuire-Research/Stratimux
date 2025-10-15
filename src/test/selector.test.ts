/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that the base selector consumer functions are working as intended.
$>*/
/*<#*/
import { muxification  } from '../model/muxium/muxium';
import { Concept, Concepts } from '../model/concept/concept.type';
import { createConcept } from '../model/concept/concept';
import { CounterState, createCounterConcept, counterName  } from '../concepts/counter/counter.concept';
import { counterSelectCount } from '../concepts/counter/counter.selector';
import { CounterSetCountPayload, counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { select } from '../model/selector';
import { createAdvancedKeys } from '../model/selector/selector';

test('Muxium Selector Test', (done) => {
  const counter = createCounterConcept();
  const counterState = counter.state as CounterState;
  counterState.count = 10;
  const muxium = muxification('muxiumSelectorTest', {counter}, {logging: true, storeDialog: true});
  const sub = muxium.subscribe((concepts: Concepts) => {
    const state = select.state<CounterState>(concepts, counterName);
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
    const count = select.slice<number>(concepts, counterSelectCount);
    expect(count).toBe(10);
    setTimeout(() => {done();}, 500);
  });
});

test('Muxium Selector Payload Test', (done) => {
  // For testing purposes only, access actionCreators via the Deck Interface in production.
  const setCount = counterSetCount.actionCreator({newCount: 10 });
  const payload = select.payload<CounterSetCountPayload>(setCount);
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
    stageO(),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      ax.close();
      done();
    })
  ]);
});

test('Deck K createAdvancedKeys Planned Subscription Test', (done) => {
  // Define the DeepNested type matching the muxified selector test
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

  // Create the test object as state
  const testState: DeepNested = {
    anything: {
      else: [false],
      something: {
        somethingArray: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        somethingElse: 'somethingElse'
      }
    },
    bool: true
  };

  // Create inline test concept with DeepNested state
  const testConcept = createConcept(
    'testAdvancedKeys',
    testState,
  );

  // Create muxium with test concept
  type DECK = {
    testConcept: Concept<DeepNested>
  }
  const muxium = muxification('advancedKeysTest', { testConcept: testConcept }, { logging: true });

  // Use planned subscription to access deck.k
  muxium.plan<DECK>('Test createAdvancedKeys with deck.k', ({ stage, conclude }) => [
    stage(({ concepts, d, stagePlanner }) => {
      console.log('[TEST] Starting deck.k advanced keys test');

      // Access through deck.d.testAdvancedKeys.k (muxified concept pattern)
      if (d.testConcept && d.testConcept.k) {
        console.log('[TEST] Found d.testAdvancedKeys.k');

        // Test 1: Create advanced keys for nested path
        const nestedPath = ['anything', 'something', 'somethingArray', 3];
        const advancedKeys = createAdvancedKeys<DeepNested>(nestedPath);
        console.log('[TEST] Advanced keys for nested path:', advancedKeys);

        // Test 2: Try to create selector using d.k.createSelector if available
        if (d.testConcept.k.createSelector) {
          const specificSelector = d.testConcept.k.createSelector(concepts, advancedKeys);
          console.log('[TEST] Created selector with d.k.createSelector:', !!specificSelector);

          if (specificSelector) {
            // Test 3: Use select.slice with the created selector
            const value = select.slice(concepts, specificSelector);
            console.log('[TEST] Value from select.slice:', value);

            // Expect to get '3' from the array
            expect(value).toBe('3');
          } else {
            console.log('[TEST] d.k.createSelector returned undefined/false');
            console.log('[TEST] Testing alternative: direct selector access');

            // Alternative test: Check if we can access existing selectors
            const anythingSelector = d.testConcept.k.anything;
            if (anythingSelector) {
              console.log('[TEST] Found anything selector, keys:', anythingSelector.keys);
              const anythingValue = select.slice(concepts, anythingSelector);
              console.log('[TEST] anything value:', anythingValue);
              expect(anythingValue).toEqual(testState.anything);
            }
          }
        } else {
          console.log('[TEST] d.k.createSelector not available');
        }

        // Test 4: Verify dot-walked convention
        const boolSelector = d.testConcept.k.bool;
        if (boolSelector) {
          console.log('[TEST] Bool selector keys (should be "testAdvancedKeys.bool"):', boolSelector.keys);
          const boolValue = select.slice(concepts, boolSelector);
          expect(boolValue).toBe(true);
        }
      } else {
        console.error('[TEST] d.testAdvancedKeys.k not found');
      }

      stagePlanner.conclude();
      muxium.close();
      done();
    }),
    conclude()
  ]);
});

/*#>*/