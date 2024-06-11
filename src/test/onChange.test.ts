/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
In addition utilize the onChange detection feature for the UnifiedSubject is working as intended.
$>*/
/*<#*/
import { createAxium, getAxiumState } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectSlice, selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { axiumSelectLastStrategy } from '../concepts/axium/axium.selector';
import { initializeTopic } from '../concepts/axium/strategies/initialization.strategy';
import { Concepts } from '../model/concept';

test('Axium onChange Test', (done) => {
  const selectorRouter = {
    [axiumSelectLastStrategy.keys]: (concepts: Concepts) =>
      console.log('CHECK: ', selectSlice(concepts, axiumSelectLastStrategy))
  };
  const axium = createAxium('axiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan with selectors',
    ({stage, d__}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        console.log('What is this Keyed Selector?', d.counter.k.count.select());
        console.log('WHAT IS THIS', selectSlice(concepts, axiumSelectLastStrategy));
        if (selectSlice(concepts, axiumSelectLastStrategy) === initializeTopic) {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true
            });
          } else {
            stagePlanner.conclude();
            expect(true).toBe(false);
            setTimeout(() => done(), 50);
          }
        }
      }, {selectors: [d__.axium.k.lastStrategy]}),
      stage(({concepts, dispatch, changes, d, e}) => {
        console.log('Check Changes: ',  changes);
        changes?.forEach(keyed => {
          selectorRouter[keyed.keys] ? selectorRouter[keyed.keys](concepts) : null;
        });
        const axiumState = getAxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (axiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          // After next improvement
          // expect(d.counter.k.count.select()).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          axium.close();
        } else {
          dispatch(e.axiumKick(), {
            newSelectors: [d.counter.k.count, d.axium.k.lastStrategy],
            throttle: 0
          });
        }
      }, {
        selectors: [d__.counter.k.count]
      })
    ]);
});
/*#>*/