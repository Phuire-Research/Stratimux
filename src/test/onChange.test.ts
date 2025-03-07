/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
In addition utilize the onChange detection feature for the MuxifiedSubject is working as intended.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { selectSlice, selectState } from '../model/selector/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterDeck } from '../concepts/counter/counter.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { muxiumSelectLastStrategy } from '../concepts/muxium/muxium.selector';
import { initializeTopic } from '../concepts/muxium/strategies/initialization.strategy';
import { Concepts } from '../model/concept/concept.type';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';
import { getMuxiumState } from '../model/muxium/muxiumHelpers';

test('Muxium onChange Test', (done) => {
  const selectorRouter: Record<string, any> = {
    [muxiumSelectLastStrategy.keys]: (concepts: Concepts) =>
      console.log('CHECK: ', selectSlice(concepts, muxiumSelectLastStrategy))
  };
  const muxium = muxification('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});

  const plan = muxium.plan<CounterDeck>('Counting Strategy Plan with selectors',
    ({stage, d__}) => [
      stage(({stagePlanner, concepts, dispatch, d}) => {
        console.log('What is this Keyed Selector?', d.counter.k.count.select());
        console.log('WHAT IS THIS', selectSlice(concepts, muxiumSelectLastStrategy));
        if (selectSlice(concepts, muxiumSelectLastStrategy) === initializeTopic) {
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
      }, {selectors: [d__.muxium.k.lastStrategy]}),
      stage(({concepts, dispatch, changes, d, e}) => {
        console.log('Check Changes: ',  changes);
        changes?.forEach(keyed => {
          selectorRouter[keyed.keys] ? selectorRouter[keyed.keys](concepts) : null;
        });
        const muxiumState = getMuxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (muxiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          // After next improvement
          // expect(d.counter.k.count.select()).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          muxium.close();
        } else {
          dispatch(e.muxiumKick(), {
            newSelectors: [d.counter.k.count, d.muxium.k.lastStrategy],
            throttle: 0
          });
        }
      }, {
        selectors: [d__.counter.k.count]
      })
    ]);
});
/*#>*/