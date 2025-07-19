/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that action origin is functioning as intended.
$>*/
/*<#*/
import { CounterAdd, counterAdd } from '../concepts/counter/qualities/add.quality';
import { createOrigin, getMuxiumState } from '../model/muxium/muxiumHelpers';
import { muxification } from '../model/muxium/muxium';
import { createExperimentConcept, experimentName } from '../concepts/experiment/experiment.concept';
import { CounterDeck, CounterState } from '../concepts/counter/counter.concept';
import { CounterSetCount, counterSetCount } from '../concepts/counter/qualities/setCount.quality';
import { selectState } from '../model/selector/selector';
import { PrincipleFunction } from '../model/principle';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';
import { Concept } from '../model/concept/concept.type';
import { Deck } from '../model/deck';
import { Quality } from '../model/quality';

test('Origin Creation', (done) => {
  expect(createOrigin({conceptName: 'one', originType: 'two'})).toBe('one+two');
  expect(createOrigin({conceptName: 'one', originType: 'two', specificType: 'three'})).toBe('one+two+three');
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
  type ExperimentCounterQualities = {
    counterAdd: CounterAdd,
    counterSetCount: CounterSetCount
  };
  type DECK = {
    experiment: Concept<CounterState, Quality<CounterState, ExperimentCounterQualities>, CounterDeck>
  }
  const muxium = muxification<DECK>('Override actions based on Plan and Stage', {
    experiment: createExperimentConcept<CounterState, ExperimentCounterQualities>({
      count: 0,
    } as CounterState,
    experimentCounterQualities, [
      ({concepts_, plan}) => {
        const {
          body
        } = getMuxiumState(concepts_);
        const stageName = 'Test Override';
        const planTestOverride = plan(stageName, ({stage, stageO, d__}) => [
          stageO(() => d__.muxium.e.muxiumKick()),
          stage(({dispatch, e, origin}) => {
            new Array(10).fill('').forEach((_, i) => {
              const alteredOrigin = origin.split('+');
              alteredOrigin[2] = i + '';
              body.push(e.counterAdd({
                origin: alteredOrigin.join('+')
              }));
            });
            const alteredOrigin = origin.split('+');
            alteredOrigin[2] = 3 + '';
            body.push(e.counterSetCount({
              newCount: Infinity
            }, {
              origin: alteredOrigin.join('+')
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
      stage(({dispatch, d, origin}) => {
        console.log('CHECK D', Object.keys(d));
        new Array(10).fill('').forEach((_, i) => {
          const alteredOrigin = origin.split('+');
          alteredOrigin[2] = i + '';
          body.push(d.experiment.e.counterAdd({
            origin: alteredOrigin.join('+')
          }));
        });
        const alteredOrigin = origin.split('+');
        alteredOrigin[2] = 0 + '';
        body.push(d.experiment.e.counterSetCount({
          newCount: Infinity
        }, {
          origin: alteredOrigin.join('+')
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
            planOverride: true,
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