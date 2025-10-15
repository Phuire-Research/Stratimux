/*<$
For the asynchronous graph programming framework Stratimux, generate a tests and demonstrates how register timeout quality functions.
$>*/
/*<#*/
import { CounterDeck, CounterState, counterName, createCounterConcept } from '../../concepts/counter/counter.concept';
import { counterSelectCount } from '../../concepts/counter/counter.selector';
import { createAction } from '../../model/action/action';
import { muxification } from '../../model/muxium/muxium';
import { selectState } from '../../model/selector/selector';

test('Muxium Register Time Out', (done) => {
  const muxium = muxification('timeout defer actions', {counter: createCounterConcept()}, {
    // logActionStream: true
  });
  muxium.plan<CounterDeck>('timeout add 4 after 10ms', ({stage, stageO, e__, conclude}) => [
    stageO(),
    stage(({dispatch, d}) => {
      dispatch(createAction('Muxium Register Time Out', { payload: {
        act: d.counter.e.counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    stage(({concepts, dispatch, d}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(createAction('Muxium Register Time Out', { payload: {
        act: d.counter.e.counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    stage(({concepts, dispatch, d}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(createAction('Muxium Register Time Out', { payload: {
        act: d.counter.e.counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    stage(({concepts, dispatch, d}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(createAction('Muxium Register Time Out', { payload: {
        act: d.counter.e.counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    stage(({concepts, changes, stagePlanner}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      if (changes.length > 0) {
        expect(counterState?.count).toBe(4);
        setTimeout(() => {
          stagePlanner.conclude();
          muxium.close();
          done();
        }, 10);
      }
    }, {selectors: [counterSelectCount], beat: 200}),
    conclude()
  ]);
});

/*#>*/