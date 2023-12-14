# The Floating Point Error Correction Issue in Graph Computation
Noting that each strategy should be a unique variation within this test. As we are repeating the first step 10 times. Each time we are creating a new strategy. But due to branch prediction, and likewise floating point error correction. This test presents itself as successful. Noting the included log. As if the first iteration is all that runs.
```typescript
const plan = axium.stage('Counting Strategy Stage',
    [
      (_, dispatch) => {
        const [shouldBe, strategy] = generateRandomCountingStrategy(count);
        strategyTopic = strategy.topic;
        expectedOutput = shouldBe;
        totalExpected += expectedOutput;
        dispatch(strategyBegin(strategy), {
          iterateStage: true,
          throttle: 1
        });
      }, (concepts, dispatch) => {
        const axiumState = getAxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        if (axiumState.lastStrategy === strategyTopic && counter) {
          console.log('Count: ', counter?.count, 'Topic: ', axiumState.lastStrategy, 'Steps: ', steps, 'Repeating for: ',  repeat);
          console.log('Expected: ', expectedOutput);
          expect(counter.count).toBe(expectedOutput);
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
      }
    ]);
```
The following are the Topics generated upon each iteration, noting each should be unique:
* 'Count:  -5 Topic: Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  0 Repeating for:  10' 
* 'Count:  -5 Topic: Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  1 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  2 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  3 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  4 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  5 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  6 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  7 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  8 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  9 Repeating for:  10'
* 'Count:  -5 Topic:  Generated Counting Strategy from: 0, using 1 Adds and 6 Subtracts Steps:  10 Repeating for:  10'

Notice that the steps are increasing. And the strategies are executing as intended, without the count being effected beyond the first successful dispatch. As even if, the same strategy was being dispatched. The count should be going down by 5, upon each successful iteration.

This is noting that within logixUX I have a version of this form of counting that does not experience this same issue. [See this strategy and compare.](https://github.com/Phuire-Research/logixUX/blob/main/server/src/concepts/logixUX/strategies/generateCountingStrategy.strategy.ts). The only change is the placement of the random number generation. Otherwise this is the same strategy.

Therefore, branch prediction in combination with floating point error correction as used within the random number generation process. Is causing a direct hallucination in a program written by hand. This test may vary by computer, but that only serves to demonstrate that this paradigm of computation reveals that we have pushed such to a limit.

Why would the same output be repeated? I do know the reason, but will leave others to attempt to figure out why this might be the case.