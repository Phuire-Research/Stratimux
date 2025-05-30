/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { getMuxiumState } from '../model/muxium/muxiumHelpers';
import { selectState } from '../model/selector/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterQualities } from '../concepts/counter/counter.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { Concept } from '../model/concept/concept.type';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

test('Muxium Counting Strategy Test', (done) => {
  const cpts = {counter: createCounterConcept()};
  const muxium = muxification('muxiumStrategyTest', cpts, {logging: true, storeDialog: true});

  type DECK = {
    counter: Concept<CounterState, CounterQualities>;
  };
  const plan = muxium.plan<DECK>('Counting Strategy Plan',
    ({stage}) => [
      stage(({stagePlanner, dispatch, d, e}) => {
        const str = countingStrategy(d);
        if (str) {
          dispatch(strategyBegin(str), {
            iterateStage: true
          });
        } else {
          stagePlanner.conclude();
          expect(false).toBe(true);
          setTimeout(() => {done();}, 500);
        }
      }),
      stage(({concepts, d}) => {
        const muxiumState = getMuxiumState(concepts);
        if (muxiumState.lastStrategy === countingTopic) {
          const counter = selectState<CounterState>(concepts, counterName);
          expect(counter?.count).toBe(1);
          expect(d.counter.k.count.select()).toBe(1);
          console.log('CHECK FINAL COUNT: ', d.counter.k.count.select());
          setTimeout(() => {done();}, 500);
          plan.conclude();
          muxium.close();
        }
      })
    ]);
});
/*#>*/