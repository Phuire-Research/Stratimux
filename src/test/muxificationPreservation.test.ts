/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that muxified concepts inherit their muxified names as intended.
$>*/
/*<#*/
import { CounterDeck, CounterQualities, CounterState, createCounterConcept } from '../concepts/counter/counter.concept';
import { createConcept } from '../model/concept/concept';
import { AnyConcept, Concept } from '../model/concept/concept.type';
import { muxifyConcepts } from '../model/concept/conceptAdvanced';
import { muxification } from '../model/muxium/muxium';
import { Muxium } from '../model/muxium/muxium.type';

const noise = (muxium: Muxium<any>, final: boolean, done: jest.DoneCallback) => {
  type Deck = {
    muxified: Concept<CounterState, CounterQualities, CounterDeck>,
  }
  const ID = Math.random();
  muxium.plan<Deck>('Demuxification Preserveration' + ID, ({stage, staging}) => staging(() => {
    return [
      ...(() => {
        const stages = new Array(10).fill(stage(() => {
          //
        })).map((_, i) => stage(({d, e, dispatch, concepts}) => {
          // console.log('CHECK', d);
          // console.log(`${i}: ${ID} One`, d.muxified.d.one.k.state(concepts));
          // console.log(`${i}: ${ID} Counter`, d.muxified.d.counter.k.count.select());
          // console.log(`${i}: ${ID} Muxified`, d.muxified.k.count.select());
          dispatch(d.muxified.d.counter.e.counterAdd(), {
            iterateStage: true
          });
        }));
        return stages;
      })(),
      stage(({d, stagePlanner, concepts}) => {
        console.log(`FINAL: ${ID} One`, d.muxified.d.one.k.getState(concepts));
        console.log(`FINAL: ${ID} Counter`, d.muxified.d.counter.k.count.select());
        console.log(`FINAL: ${ID} Muxified`, d.muxified.k.count.select());
        console.log('CHECK FINAL: ', d.muxified.d.counter);
        expect(d.muxified.d.counter.k.count.select()).toBe(d.muxified.k.count.select());
        if (final) {
          setTimeout(() => {
            done();
          }, 1000);
        }
        stagePlanner.conclude();
      })
    ];
  }));
};

describe('Stratimux\'s Demuxify Preservation of Original Concepts Test', () => {
  test('Demuxify Preservation Test', (done) => {
    const one = createConcept(
      'one',
      {},
    );
    const muxified = muxifyConcepts([
      one, createCounterConcept()
    ],
    createConcept('muxified', {})
    );
    const muxium = muxification('Demuxification Preservation', {
      muxified
    });

    const recurse = (limiter = 0) => {
      // Note 661 Ok 662 it Breaks.
      // Would change depending on environment.
      // Note adding the new createStaging helper function in this process has this working at 660 and breaks at 661
      // Very Easy Test of the Cost of Abstraction
      if (limiter === 10) {
        noise(muxium as unknown as Muxium<any>, true, done);
      } else {
        noise(muxium as unknown as Muxium<any>, false, done);
        setTimeout(() => {
          recurse(limiter + 1);
        }, 0);
      }
    };
    recurse(0);
  });
});
/*#>*/