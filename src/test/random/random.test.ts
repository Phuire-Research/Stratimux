import { createAxium, getAxiumState } from '../../model/axium';
import { strategyBegin } from '../../model/actionStrategy';
import { selectState } from '../../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../../concepts/counter/counter.concept';
import { generateRandomCountingStrategy } from './generateCountingStrategy.strategy';
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { createStage } from '../../model/stagePlanner';

test('Axium Counting Strategy Test', (done) => {
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], true, true);
  let strategyTopic = '';
  let expectedOutput = 0;
  let totalExpected = 0;
  let count = 0;
  const repeat = 10;
  let steps = 0;
  const plan = axium.plan('Counting Strategy Stage',
    [
      createStage((_, dispatch) => {
        const [shouldBe, strategy] = generateRandomCountingStrategy(count);
        strategyTopic = strategy.topic;
        expectedOutput = shouldBe;
        totalExpected += expectedOutput;
        dispatch(strategyBegin(strategy), {
          iterateStage: true,
          throttle: 1
        });
      }),
      createStage((concepts, dispatch) => {
        const axiumState = getAxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (axiumState.lastStrategy === strategyTopic && counter) {
          console.log('Count: ', counter?.count, 'Topic: ', axiumState.lastStrategy, 'Steps: ', steps, 'Repeating for: ',  repeat);
          console.log('Expected: ', expectedOutput);
          expect(counter.count).toBe(totalExpected);
          if (steps < repeat) {
            steps++;
            count = counter.count;
            dispatch(axiumKick(), {
              setStage: 0,
              throttle: 1
            });
          } else {
            console.log('Total Expected: ', totalExpected, counter.count);
            expect(counter.count).toBe(totalExpected);
            setTimeout(() => {done();}, 500);
            plan.conclude();
            axium.close();
          }
        }
      })
    ]);
});