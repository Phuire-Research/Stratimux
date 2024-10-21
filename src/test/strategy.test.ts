/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
$>*/
/*<#*/
import { muxification, getMuxiumState } from '../model/muxium';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterQualities } from '../concepts/counter/counter.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { Concept } from '../model/concept';
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
        console.log('HIT!!!');
        e.muxiumKick();
        // Start HERE
        d.counter.e.counterAdd();
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
      stage(({concepts}) => {
        const muxiumState = getMuxiumState(concepts);
        if (muxiumState.lastStrategy === countingTopic) {
          const counter = selectState<CounterState>(concepts, counterName);
          expect(counter?.count).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          muxium.close();
        }
      })
    ]);
});
/*#>*/