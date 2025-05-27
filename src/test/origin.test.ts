/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that action origin is functioning as intended.
$>*/
/*<#*/
import { counterAdd } from '../concepts/counter/qualities/add.quality';
import { createOrigin, getMuxiumState } from '../model/muxium/muxiumHelpers';
import { muxification } from '../model/muxium/muxium';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { CounterState } from '../concepts/counter/counter.concept';
import { counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { selectState } from '../model/selector/selector';
import { PrincipleFunction } from '../model/principle';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';
import { Concept } from '../model/concept/concept.type';
import { Deck } from '../model/deck';

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
    counterAdd,
    counterSetCount
  };
  const muxium = muxification('Override actions based on Plan and Stage', {experiment: createExperimentConcept({
    count: 0,
  } as CounterState,
  experimentCounterQualities, [
    ({concepts_, plan}) => {
      const {
        body
      } = getMuxiumState(concepts_);
      const stageName = 'Test Override';
      const planTestOverride = plan(stageName, ({stage, stageO, d__}) => [
        stageO(() => (d__ as Deck<MuxiumDeck>).muxium.e.muxiumKick()),
        stage(({dispatch, e, d}) => {
          new Array(10).fill('').forEach(() => body.push(e.counterAdd()));
          body.push(e.counterSetCount({
            newCount: Infinity
          }, {
            origin: createOrigin([stageName, 3])
          }));
          dispatch(e.counterAdd(), {
            iterateStage: true
          });
        }),
        stage(({concepts, dispatch, d, e}) => {
          const count = selectState<CounterState>(concepts, experimentName)?.count;
          let exists = false;
          getMuxiumState(concepts).body.forEach(a => {
            if (a.type === e.counterAdd().type) {
              exists = true;
            }
          });
          if (exists) {
            const newCount = count !== undefined ? count  * 2 : 0;
            finalDispatchedSet = newCount;
            dispatch(e.counterSetCount({
              newCount
            }), {
              // iterateStage: true,
              throttle: 0,
              override: true,
            });
          } else {
            dispatch((d as Deck<MuxiumDeck>).muxium.e.muxiumKick(), {
              iterateStage: true
            });
          }
        // }, {selectors: [createMuxifiedKeyedSelector<CounterState>(cpts, s, 'count') as KeyedSelector]}),
        }),
        stage(() => {
          planTestOverride.conclude();
        })
      ]);
    }
  ])}, {
    // storeDialog: true,
    // logging: true,
    // logActionStream: true
  });
  const sub = muxium.subscribe(concepts => {
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
      muxium.close();
      expect(finalCount).toBe(finalDispatchedSet);
      if (finalCount === -1) {
        console.log('Final: ', finalCount, finalDispatchedSet);
        expect(false).toBe(true);
      }
      if (finalCount === Infinity) {
        console.log('Final: ', finalCount, finalDispatchedSet);
        console.log(finalCount);
        expect(false).toBe(true);
      }
      setTimeout(() => {
        done();
      }, 10);
    }, 100));
  });
});

test('Test Dispatch Override', (done) => {
  const timer: NodeJS.Timeout[] = [];
  let finalDispatchedSet = -1;
  let finalCount = -1;
  let steps = 0;
  const qualities = {
    counterAdd,
    counterSetCount
  };
  type ExperimentDeck = {
    experiment: Concept<CounterState, typeof qualities>
  }
  const principle: PrincipleFunction<typeof qualities, MuxiumDeck & ExperimentDeck, CounterState> = ({plan, concepts_}) => {
    const {
      body
    } = getMuxiumState(concepts_);
    const stageName = 'Test Hard Override';
    plan(stageName, ({stage, stageO, d__}) => [
      stageO(() => {
        return d__.muxium.e.muxiumKick();
      }),
      stage(({dispatch, d}) => {
        new Array(10).fill('').forEach((_, i) => {
          body.push(d.experiment.e.counterAdd({
            origin: createOrigin([stageName, i + ''])
          }));
        });
        body.push(d.experiment.e.counterSetCount({
          newCount: Infinity
        }, {
          origin: createOrigin([stageName, 0])
        }));
        dispatch(d.experiment.e.counterAdd(), {
          iterateStage: true
        });
      }),
      stage(({concepts, dispatch, c, d}) => {
        const count = selectState<CounterState>(concepts, experimentName)?.count;
        let exists = false;
        getMuxiumState(concepts).body.forEach(a => {
          if (c.counterAdd(a)) {
            exists = true;
          }
        });
        if (exists) {
          const newCount = 765;
          finalDispatchedSet = newCount;
          dispatch(d.experiment.e.counterSetCount({
            newCount
          }), {
            // iterateStage: true,
            throttle: 0,
            hardOverride: true,
          });
        } else {
          dispatch(d.muxium.e.muxiumKick(), {
            iterateStage: true
          });
        }
      // }, {selectors: [createMuxifiedKeyedSelector<CounterState>(cpts, s, 'count') as KeyedSelector]}),
      }),
      stage(({stagePlanner}) => {
        stagePlanner.conclude();
      })
    ]);
  };
  const muxium = muxification('Hard Override actions based on Plan and Stage', { experiment: createExperimentConcept({
    count: 0,
  } as CounterState, qualities, [
    principle
  ])}, {
    // storeDialog: true,
    // logging: true,
    logActionStream: true
  });
  const sub = muxium.subscribe(concepts => {
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
      muxium.close();
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
    }, 1000));
  });
});
/*#>*/