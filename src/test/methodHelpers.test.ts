/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure that method helpers are working as intended.
$>*/
/*<#*/
import { muxiumSelectLastStrategy, muxiumSelectLastStrategyData } from '../concepts/muxium/muxium.selector';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import {
  ExperimentAsyncIterateIdThenReceiveInMethod,
  experimentAsyncIterateIdThenReceiveInMethod,
} from '../concepts/experiment/qualities/asyncIterateIdThenReceiveInMethod.quality';
import { ExperimentIterateIdThenReceiveInMethod, experimentIterateIdThenReceiveInMethod } from '../concepts/experiment/qualities/iterateIdThenReceiveInMethod.quality';
import { ExperimentMockToTrue, experimentMockToTrue } from '../concepts/experiment/qualities/mockToTrue.quality';
import { ExperimentTimerEmitAction, experimentTimerEmitAction } from '../concepts/experiment/qualities/timerEmitAction.quality';
import { ExperimentTimerEmitActionWithState, experimentTimerEmitActionWithState} from '../concepts/experiment/qualities/timerEmitActionWithState.quality';
import {
  experimentAsyncIterateIdThenAddToData,
  experimentAsyncIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/asyncIterateIdThenAddToData.strategy';
import {
  iterateIdThenAddToData,
  experimentIterateIdThenAddToDataTopic
} from '../concepts/experiment/strategies/iterateIdThenAddToData.strategy';
import { experimentTimedMockToTrue } from '../concepts/experiment/strategies/timedMockToTrue.strategy';
import {
  timedMockToTrueWithState,
  experimentTimedMockToTrueWithStateTopic
} from '../concepts/experiment/strategies/timedMockToTrueWithState.strategy';
import { muxification } from '../model/muxium/muxium';
import { selectSlice, selectState } from '../model/selector/selector';
import { Concept } from '../model/concept/concept.type';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

test('Async Method Test', (done) => {
  const qualities = {experimentTimerEmitAction, experimentMockToTrue};
  type Qualities = {
    experimentTimerEmitAction: ExperimentTimerEmitAction,
    experimentMockToTrue: ExperimentMockToTrue
  };
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(initialState, qualities);

  type DECK = {
    experiment: Concept<typeof initialState, Qualities>;
  }

  const muxium = muxification('Experiment async method creator', {experiment});
  const plan = muxium.plan<DECK>('timed mock to true', ({e__, stage, stageO}) => [
    // Noting that the muxiumKickQuality here is temporary until the type and action creators are removed entirely
    stageO(() => e__.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentTimedMockToTrue(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState?.mock) {
        expect(experimentState.mock).toBe(true);
        plan.conclude();
        muxium.close();
        done();
      }
    })
  ]);
});

test('Async Method Plain Iterate Id Test', (done) => {
  const qualities = {experimentAsyncIterateIdThenReceiveInMethod};
  type Qualities = {experimentAsyncIterateIdThenReceiveInMethod: ExperimentAsyncIterateIdThenReceiveInMethod};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept<typeof initialState, Qualities>(initialState, qualities);

  type DECK = {
    experiment: Concept<typeof initialState, Qualities>;
  }

  const muxium = muxification('Experiment async method creator', {experiment});
  const plan = muxium.plan<DECK>('timed mock to true', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(d.experiment.e.experimentAsyncIterateIdThenReceiveInMethod(), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      console.log(experiment.state);
      if (experimentState?.id) {
        expect(experimentState.id).toBe(1);
        setTimeout(() => {
          plan.conclude();
          done();
          muxium.close();
        }, 50);
      }
    })
  ]);
});

test('Async Method with State Test', (done) => {
  const qualities = {experimentTimerEmitActionWithState, experimentMockToTrue};
  type Qualities = {
    experimentTimerEmitActionWithState: ExperimentTimerEmitActionWithState,
    experimentMockToTrue: ExperimentMockToTrue
  };
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(initialState, qualities);

  type DECK = {
    experiment: Concept<typeof initialState, Qualities>;
  }

  const muxium = muxification('Experiment async method creator with State', {experiment});
  const plan = muxium.plan<DECK>('timed mock to true', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(timedMockToTrueWithState(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        if (lastStrategy === experimentTimedMockToTrueWithStateTopic) {
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          if (data) {
            expect(data.mock).toBe(false);
            expect(experimentState.mock).toBe(true);
            plan.conclude();
            muxium.close();
            done();
          }
        }
      }
    })
  ]);
});

test('Method Test with State id comparison', (done) => {
  const qualities = {experimentIterateIdThenReceiveInMethod};
  type Qualities = {experimentIterateIdThenReceiveInMethod: ExperimentIterateIdThenReceiveInMethod};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(createExperimentState(), qualities);

  type DECK = {
    experiment: Concept<typeof initialState, Qualities>;
  }
  const muxium = muxification('Experiment observe how concepts updates via reducer and method', {experiment});
  const plan = muxium.plan<DECK>('Iterate id', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(iterateIdThenAddToData(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
        console.log('CHECK LAST STRATEGY', lastStrategy);
        if (lastStrategy === experimentIterateIdThenAddToDataTopic) {
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          if (data) {
            console.log('Strategy Data: ', data.id, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(experimentState.id).toBe(1);
            plan.conclude();
            muxium.close();
            done();
          }
        }
      }
    })
  ]);
});

test('Async Method Test with State id comparison', (done) => {
  type Qualities = {experimentAsyncIterateIdThenReceiveInMethod: ExperimentAsyncIterateIdThenReceiveInMethod};
  const qualities = {experimentAsyncIterateIdThenReceiveInMethod};
  const initialState = createExperimentState();
  const experiment = createExperimentConcept(initialState, qualities);

  type DECK = {
    experiment: Concept<typeof initialState, Qualities>;
  };

  const muxium = muxification('Experiment observe how concepts updates via reducer and method', {experiment});
  const plan = muxium.plan<DECK>('Iterate id', ({stage, stageO, e__}) => [
    stageO(() => e__.muxiumKick()),
    stage(({dispatch, d}) => {
      dispatch(strategyBegin(experimentAsyncIterateIdThenAddToData(d)), {
        iterateStage: true
      });
    }),
    stage(({concepts}) => {
      const lastStrategy = selectSlice(concepts, muxiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState) {
        if (lastStrategy === experimentAsyncIterateIdThenAddToDataTopic) {
          const data = selectSlice<ExperimentState>(concepts, muxiumSelectLastStrategyData);
          if (data) {
            console.log('Async Strategy Data: ', data.id, 'Experiment State ID: ', experimentState.id);
            expect(data.id).toBe(0);
            expect(experimentState.id).toBe(1);
            plan.conclude();
            muxium.close();
            done();
          }
        }
      }
    })
  ]);
});
/*#>*/