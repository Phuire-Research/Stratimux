/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies
with priority are working as intended.
$>*/
/*<#*/
import { createAxium, getAxiumState, isAxiumOpen } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { createStage } from '../model/stagePlanner';
import { generateRandomCountingStrategy } from './random/generateCountingStrategy.strategy';
import { axiumSelectLastStrategy } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { handlePriority } from '../model/priority';

test('Axium Counting Strategy Priority Test', (done) => {
  const concluded = [false, false, false];
  const [count1, strategy1] = generateRandomCountingStrategy(0);
  strategy1.topic += 1;
  strategy1.priority = 100;
  const [count2, strategy2] = generateRandomCountingStrategy(0);
  strategy1.topic += 2;
  const [count3, strategy3] = generateRandomCountingStrategy(0);
  strategy3.priority = 50;
  strategy1.topic += 3;
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy with Priority Plan',
    ({stage}) => [
      stage(({concepts, dispatch}) => {
        if (isAxiumOpen(concepts)) {
          handlePriority(getAxiumState(concepts), strategyBegin(strategy1));
          handlePriority(getAxiumState(concepts), strategyBegin(strategy2));
          handlePriority(getAxiumState(concepts), strategyBegin(strategy3));
          console.log('COUNT ONE STRATEGY OUTCOME: ', count1);
          console.log('COUNT TWO STRATEGY OUTCOME: ', count2);
          console.log('COUNT THREE STRATEGY OUTCOME: ', count3);
          dispatch(axiumKick(), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts}) => {
        const axiumState = concepts[0].state as AxiumState;
        const counter = selectState<CounterState>(concepts, counterName);
        // console.log('CHECK COUNT', counter, 'HEAD', axiumState.head, 'BODY', axiumState.body, 'TAIL', axiumState.tail);
        if (axiumState.lastStrategy === strategy1.topic && !concluded[0]) {
          console.log('CHECK COUNT ONE', counter?.count, count1);
          concluded[0] = true;
          expect(counter?.count).toBe(count1);
        }
        if (axiumState.lastStrategy === strategy2.topic && !concluded[1]) {
          console.log('CHECK COUNT TWO', counter?.count, count2);
          concluded[1] = true;
          expect(counter?.count).toBe(count1 + count2 + count3);
        }
        if (axiumState.lastStrategy === strategy3.topic && !concluded[2]) {
          console.log('CHECK COUNT THREE', counter?.count, count3);
          concluded[2] = true;
          expect(counter?.count).toBe(count1 + count3);
        }
        if (concluded[0] && concluded[1] && concluded[2]) {
          expect(counter?.count).toBe(count1 + count2 + count3);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          axium.close();
        }
      }, {selectors: [axiumSelectLastStrategy]})
      // })
    ]);
});
/*#>*/