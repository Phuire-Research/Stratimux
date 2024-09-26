import { muxification, getMuxiumState } from '../../model/muxium';
import { strategyBegin } from '../../model/actionStrategy';
import { selectState } from '../../model/selector';
import { CounterState, createCounterConcept, counterName } from '../../concepts/counter/counter.concept';
import { generateRandomCountingStrategy } from './generateCountingStrategy.strategy';
import { createStage, stageWaitForOpenThenIterate } from '../../model/stagePlanner';

test('Muxium Counting Strategy Test', (done) => {
  const muxium = muxification('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  let strategyTopic = 'SOME STRATEGY TOPIC';
  let expectedOutput = 0;
  let totalExpected = 0;
  let count = 0;
  const repeat = 10;
  let steps = 0;
  const plan = muxium.plan('Counting Strategy Stage',
    ({e__}) => [
      stageWaitForOpenThenIterate(() => e__.muxiumKick()),
      createStage(({dispatch, d}) => {
        const [shouldBe, strategy] = generateRandomCountingStrategy(d, count);
        strategyTopic = strategy.topic;
        expectedOutput = shouldBe;
        totalExpected += expectedOutput;
        console.log('Dispatch', expectedOutput, totalExpected, count);
        dispatch(strategyBegin(strategy), {
          iterateStage: true,
          throttle: 1
        });
      }),
      createStage(({concepts, dispatch, e}) => {
        const muxiumState = getMuxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        console.log('HIT, AX', muxiumState.lastStrategy);
        if (muxiumState.lastStrategy === strategyTopic && counter) {
          console.log('Count: ', counter?.count, 'Topic: ', muxiumState.lastStrategy, 'Steps: ', steps, 'Repeating for: ',  repeat);
          console.log('Expected: ', expectedOutput);
          console.log('Steps and Repeat', steps, repeat);
          expect(counter.count).toBe(totalExpected);
          if (steps < repeat) {
            steps++;
            count = counter.count;
            console.log('KICK');
            dispatch(e.muxiumKick(), {
              setStage: 1,
              throttle: 1
            });
          } else {
            console.log('Total Expected: ', totalExpected, counter.count);
            expect(counter.count).toBe(totalExpected);
            plan.conclude();
            setTimeout(() => {done();}, 500);
            muxium.close();
          }
        }
      })
    ]);
  muxium.subscribe(concepts => console.log(getMuxiumState(concepts).lastStrategy));
});