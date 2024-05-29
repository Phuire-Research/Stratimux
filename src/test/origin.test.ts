/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that action origin is functioning as intended.
$>*/
/*<#*/
import { createAction } from '../model/action';
import { counterAdd, counterAddQuality, counterAddType } from '../concepts/counter/qualities/add.quality';
import { createAxium, createOrigin, getAxiumState } from '../model/axium';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { CounterState } from '../concepts/counter/counter.concept';
import { counterSetCount, counterSetCountQuality } from '../concepts/counter/qualities/setCount.quality';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { KeyedSelector, createUnifiedKeyedSelector, selectState, selectUnifiedState } from '../model/selector';

test('Origin Creation', (done) => {
  expect(createOrigin(['one'])).toBe('one');
  expect(createOrigin(['one', 'two'])).toBe('one+two');
  expect(createOrigin(['one', 'two', 'three'])).toBe('one+two+three');
  done();
});

test('Test Dispatch Override', (done) => {
  const timer: NodeJS.Timeout[] = [];
  let finalDispatchedSet = -1;
  let finalCount = -1;
  const experimentCounterQualities = {
    counterAddQuality,
    counterSetCountQuality
  };
  type ExperimentCounterQualities = typeof experimentCounterQualities;
  const axium = createAxium('Override actions based on Plan and Stage', [createExperimentConcept<ExperimentCounterQualities>({
    count: 0,
  } as CounterState,
  experimentCounterQualities, [
    ({concepts_, plan}) => {
      const {
        body
      } = getAxiumState(concepts_);
      const stageName = 'Test Override';
      const planTestOverride = plan(stageName, () => [
        stageWaitForOpenThenIterate(() => {
          return axiumKick();
        }),
        createStage((_, dispatch) => {
          new Array(10).fill('').forEach(() => body.push(counterAdd()));
          body.push(counterSetCount({
            newCount: Infinity
          }, {
            origin: createOrigin([stageName, 3])
          }));
          dispatch(counterAdd(), {
            iterateStage: true
          });
        }),
        createStage((concepts, dispatch) => {
          const count = selectState<CounterState>(concepts, experimentName)?.count;
          let exists = false;
          getAxiumState(concepts).body.forEach(a => {
            if (a.type === counterAddType) {
              exists = true;
            }
          });
          if (exists) {
            const newCount = count !== undefined ? count  * 2 : 0;
            finalDispatchedSet = newCount;
            dispatch(counterSetCount({
              newCount
            }), {
              // iterateStage: true,
              throttle: 0,
              override: true,
            });
          } else {
            dispatch(axiumKick(), {
              iterateStage: true
            });
          }
        // }, {selectors: [createUnifiedKeyedSelector<CounterState>(cpts, s, 'count') as KeyedSelector]}),
        }),
        createStage(() => {
          planTestOverride.conclude();
        })
      ]);
    }
  ])], {
    // storeDialog: true,
    // logging: true,
    // logActionStream: true
  });
  const sub = axium.subscribe(concepts => {
    const count = selectState<CounterState>(concepts, experimentName)?.count;
    if (count !== undefined) {
      finalCount = count;
    }
    const t = timer.shift();
    if (t) {
      clearTimeout(t);
    }
    timer.push(setTimeout(() => {
      // expect(count).toBe();
      sub.unsubscribe();
      axium.close();
      console.log('Final: ', finalCount, finalDispatchedSet);
      expect(finalCount).toBe(finalDispatchedSet);
      if (finalCount === -1) {
        expect(false).toBe(true);
      }
      if (finalCount === Infinity) {
        expect(false).toBe(true);
      }
      setTimeout(() => {
        done();
      }, 10);
    }, 100));
  });
});

// PUNT
// test('Test Dispatch Override', (done) => {
//   const timer: NodeJS.Timeout[] = [];
//   let finalDispatchedSet = -1;
//   let finalCount = -1;
//   let steps = 0;
//   const axium = createAxium('Hard Override actions based on Plan and Stage', [createExperimentConcept({
//     count: 0,
//   } as CounterState, [
//     counterAddQuality,
//     counterSetCountQuality
//   ], [
//     (obs, cpts, c$, s) => {
//       const {
//         body
//       } = getAxiumState(cpts);
//       const stageName = 'Test Hard Override';
//       const plan = c$.plan(stageName, [
//         stageWaitForOpenThenIterate(() => {
//           return axiumKick();
//         }),
//         createStage((_, dispatch) => {
//           new Array(10).fill('').forEach(() => body.push(counterAdd()));
//           body.push(counterSetCount({
//             newCount: Infinity
//           }, {
//             origin: createOrigin([stageName, 0])
//           }));
//           dispatch(counterAdd(), {
//             iterateStage: true
//           });
//         }),
//         createStage((concepts, dispatch) => {
//           const count = selectState<CounterState>(concepts, experimentName)?.count;
//           let exists = false;
//           getAxiumState(concepts).body.forEach(a => {
//             if (a.type === counterAddType) {
//               exists = true;
//             }
//           });
//           if (exists) {
//             const newCount = count !== undefined ? count  * 2 : 0;
//             finalDispatchedSet = newCount;
//             dispatch(counterSetCount({
//               newCount
//             }), {
//               // iterateStage: true,
//               throttle: 0,
//               hardOverride: true,
//             });
//           } else {
//             dispatch(axiumKick(), {
//               iterateStage: true
//             });
//           }
//         // }, {selectors: [createUnifiedKeyedSelector<CounterState>(cpts, s, 'count') as KeyedSelector]}),
//         }),
//         createStage(() => {
//           plan.conclude();
//         })
//       ]);
//     }
//   ])], {
//     // storeDialog: true,
//     // logging: true,
//     logActionStream: true
//   });
//   const sub = axium.subscribe(concepts => {
//     const count = selectState<CounterState>(concepts, experimentName)?.count;
//     if (count !== undefined) {
//       finalCount = count;
//     }
//     const t = timer.shift();
//     if (t) {
//       clearTimeout(t);
//     }
//     timer.push(setTimeout(() => {
//       // expect(count).toBe();
//       sub.unsubscribe();
//       axium.close();
//       console.log('Final: ', finalCount, finalDispatchedSet);
//       expect(finalCount).toBe(finalDispatchedSet);
//       if (finalCount === -1) {
//         expect(false).toBe(true);
//       }
//       if (finalCount === Infinity) {
//         expect(false).toBe(true);
//       }
//       setTimeout(() => {
//         done();
//       }, 10);
//     }, 100));
//   });
// });
/*#>*/