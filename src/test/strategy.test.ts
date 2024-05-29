/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { createStage } from '../model/stagePlanner';

test('Axium Counting Strategy Test', (done) => {
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan',
    () => [
      createStage(({dispatch}) => {
        console.log('HIT!!!');
        dispatch(strategyBegin(countingStrategy()), {
          iterateStage: true
        });
      }),
      createStage(({concepts}) => {
        const axiumState = concepts[0].state as AxiumState;
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