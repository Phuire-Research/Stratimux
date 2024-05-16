/*<$
For the asynchronous graph programming framework Stratimux, generate a tests and demonstrates how buffer methods perform their functionality.
$>*/
/*<#*/
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { CounterState, counterName, createCounterConcept } from '../../concepts/counter/counter.concept';
import { counterSelectCount } from '../../concepts/counter/counter.selector';
import { counterAdd } from '../../concepts/counter/qualities/add.quality';
import { counterSetCount } from '../../concepts/counter/qualities/setCount.quality';
import { createExperimentConcept, createExperimentState } from '../../concepts/experiment/experiment.concept';
import { createAxium } from '../../model/axium';
import { selectState } from '../../model/selector';
import { createStage, stageWaitForOpenThenIterate } from '../../model/stagePlanner';
import { experimentBufferMultiplyByCountFromConcepts, experimentBufferMultiplyByCountFromConceptsQuality } from './qualities/bufferMultiplyByCountFromConceptsAction.quality';
import { experimentBufferNextAction, experimentBufferNextActionQuality } from './qualities/bufferSomeAction.quality';

test('Buffer method periodic count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentBufferNextActionQuality]);
  const axium = createAxium('Experiment method buffer defer actions', [createCounterConcept(), experiment]);
  const plan = axium.plan('Experiment buffer add 4 after 10ms', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(0);
      dispatch(experimentBufferNextAction({
        action: counterAdd()
      }), {
        iterateStage: true,
      });
    }),
    createStage((concepts, _dispatch, changes) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      if (changes.length > 0) {
        expect(counterState?.count).toBe(4);
        setTimeout(() => {
          plan.conclude();
          axium.close();
          done();
        }, 10);
      }
    }, {selectors: [counterSelectCount], beat: 200}),
    createStage(() => {
      plan.conclude();
    })
  ]);
});

test('Buffer method with concept towards final multiply of count', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [experimentBufferMultiplyByCountFromConceptsQuality]);
  const axium = createAxium('Experiment method buffer defer multiply', [createCounterConcept(), experiment]);
  const plan = axium.plan('Experiment buffer multiply by 2 from concept state after 10ms', [
    stageWaitForOpenThenIterate(() => axiumKick()),
    createStage((_, dispatch) => {
      dispatch(counterSetCount({
        newCount: 2
      }), {
        iterateStage: true,
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(2);
      dispatch(experimentBufferMultiplyByCountFromConcepts(), {
        iterateStage: true,
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(2);
      dispatch(experimentBufferMultiplyByCountFromConcepts(), {
        iterateStage: true,
      });
    }),
    createStage((concepts, dispatch) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      expect(counterState?.count).toBe(2);
      dispatch(experimentBufferMultiplyByCountFromConcepts(), {
        iterateStage: true,
      });
    }),
    createStage((concepts, _dispatch, changes) => {
      const counterState = selectState<CounterState>(concepts, counterName);
      if (changes.length > 0) {
        expect(counterState?.count).toBe(16);
        setTimeout(() => {
          plan.conclude();
          axium.close();
          done();
        }, 10);
      }
    }, {selectors: [counterSelectCount], beat: 200}),
    createStage(() => {
      plan.conclude();
    })
  ]);
});
/*#>*/