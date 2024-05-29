/*<$
For the asynchronous graph programming framework Stratimux, generate a tests and demonstrates how register timeout quality functions.
$>*/
/*<#*/
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { CounterState, counterName, createCounterConcept } from '../../concepts/counter/counter.concept';
import { counterSelectCount } from '../../concepts/counter/counter.selector';
import { counterAdd } from '../../concepts/counter/qualities/add.quality';
import { createAction } from '../../model/action';
import { createAxium } from '../../model/axium';
import { selectState } from '../../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../../model/stagePlanner';

test('Axium Register Time Out', (done) => {
  const axium = createAxium('timeout defer actions', [createCounterConcept()]);
  axium.plan('timeout add 4 after 10ms', () => [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage(({dispatch}) => {
      dispatch(createAction('register an Action to Axium\'s timerLedger', { payload: {
        act: counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    createStage(({concepts, dispatch}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(createAction('register an Action to Axium\'s timerLedger', { payload: {
        act: counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    createStage(({concepts, dispatch}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(createAction('register an Action to Axium\'s timerLedger', { payload: {
        act: counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    createStage(({concepts, dispatch}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(createAction('register an Action to Axium\'s timerLedger', { payload: {
        act: counterAdd(),
        timeOut: 50
      }}), {
        iterateStage: true,
      });
    }),
    createStage(({concepts, changes, stagePlanner}) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      if (changes.length > 0) {
        expect(counterState?.count).toBe(4);
        setTimeout(() => {
          stagePlanner.conclude();
          axium.close();
          done();
        }, 10);
      }
    }, {selectors: [counterSelectCount], beat: 200}),
    createStage(({stagePlanner}) => {
      stagePlanner.conclude();
    })
  ]);
});

/*#>*/