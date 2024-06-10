/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
$>*/
/*<#*/
import { createAxium, getAxiumState } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';

test('Axium Counting Strategy Test', (done) => {
  const cpts = {counter: createCounterConcept()};
  const axium = createAxium('axiumStrategyTest', cpts, {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan',
    ({stage}) => [
      stage(({stagePlanner, dispatch, d, e}) => {
        console.log('HIT!!!');
        e.axiumKick();
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
        const axiumState = getAxiumState(concepts);
        if (axiumState.lastStrategy === countingTopic) {
          const counter = selectState<CounterState>(concepts, counterName);
          expect(counter?.count).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          axium.close();
        }
      })
    ]);
});
/*#>*/