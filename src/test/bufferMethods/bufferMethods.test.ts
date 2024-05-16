/*<$
For the asynchronous graph programming framework Stratimux, generate a tests and demonstrates how buffer methods perform their functionality.
$>*/
/*<#*/
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { CounterState, counterName, createCounterConcept } from '../../concepts/counter/counter.concept';
import { counterSelectCount } from '../../concepts/counter/counter.selector';
import { counterAdd } from '../../concepts/counter/qualities/add.quality';
import { createExperimentConcept, createExperimentState } from '../../concepts/experiment/experiment.concept';
import { strategyBegin } from '../../model/actionStrategy';
import { createAxium } from '../../model/axium';
import { selectState } from '../../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../../model/stagePlanner';
import { experimentBufferNextAction, experimentBufferNextActionQuality } from './qualities/bufferSomeAction.quality';

test('Buffer method periodic count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentBufferNextActionQuality]);
  const axium = createAxium('Experiment method buffer defer actions', [createCounterConcept(), experiment]);
  const plan = axium.plan('Experiment buffer add 4 after 10ms', [
    //
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      console.log('CHECK 1');
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
        throttle: 0
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      console.log('CHECK 2', counterState);
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
        throttle: 0
      });
    }),
    createStage((concepts, dispatch) => {
      console.log('CHECK 3');
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
        throttle: 0
      });
    }),
    createStage((concepts, dispatch) => {
      console.log('CHECK 4');
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
        throttle: 0
      });
    }),
    createStage((concepts, dispatch, changes) => {
      console.log('CHECK Final');
      const counterState = selectState<CounterState>(concepts, counterName);
      if (changes.length > 0) {
        expect(counterState?.count).toBe(4);
        setTimeout(() => {
          plan.conclude();
          axium.close();
          done();
        }, 10);
      }
    }, {selectors: [counterSelectCount], beat: 60}),
    createStage(() => {
      plan.conclude();
    })
  ]);
});
/*#>*/