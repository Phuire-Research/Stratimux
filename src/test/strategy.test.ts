/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
$>*/
/*<#*/
import { createAxium, getAxiumState } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { createStage } from '../model/stagePlanner';

test('Axium Counting Strategy Test', (done) => {
  const cpts = {counter: createCounterConcept()};
  const axium = createAxium<typeof cpts>('axiumStrategyTest', cpts, {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan',
    ({stage}) => [
      stage(({dispatch, d, e}) => {
        console.log('HIT!!!');
        e.axiumKick();
        // Start HERE
        d.counter.e;
        dispatch(strategyBegin(countingStrategy(d)), {
          iterateStage: true
        });
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