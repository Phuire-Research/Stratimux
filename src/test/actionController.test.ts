import { ActionController, createActionController$ } from '../model/actionController';
import { axiumBadActionType  } from '../concepts/axium/qualities/badAction.quality';
import { axiumLog, axiumLogType } from '../concepts/axium/qualities/log.quality';
import { ExperimentState, createExperimentConcept, createExperimentState, experimentName } from '../concepts/experiment/experiment.concept';
import { timerEmitActionQuality } from '../concepts/experiment/qualities/timerEmitAction.quality';
import { mockToTrueQuality } from '../concepts/experiment/qualities/mockTrue.quality';
import { createAxium } from '../model/axium';
import { timedMockToTrue } from '../concepts/experiment/strategies/timedMockToTrue.strategy';
import { createActionNode, strategyBegin } from '../model/actionStrategy';
import { selectSlice, selectState } from '../model/selector';
import { axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';
import { timerEmitActionWithConceptsQuality } from '../concepts/experiment/qualities/timerEmitActionWithConcepts.quality';
import {
  timedMockToTrueWithConcepts,
  timedMockToTrueWithConceptsTopic
} from '../concepts/experiment/strategies/timedMockToTrueWithConcepts.strategy';
import { axiumSelectLastStrategy, axiumSelectLastStrategyData } from '../concepts/axium/axium.selector';

test('ActionController Expired Test', (done) => {
  const act = axiumLog(undefined, 200);
  const cont = new ActionController(act);
  cont.subscribe(action => {
    expect(action.type).toBe(axiumBadActionType);
    done();
  });
});

test('ActionController Next Test', (done) => {
  const act = axiumLog(undefined, 200);
  const cont = new ActionController(act);
  cont.subscribe(action => {
    expect(action.type).toBe(axiumConcludeType);
    done();
  });
  cont.fire(act);
});

test('ActionController createActionController$ Test', (done) => {
  const act = axiumLog(undefined, 200);
  const cont = createActionController$(act, (controller, action) => {
    controller.fire(action);
  });
  cont.subscribe(action => {
    expect(action.type).toBe(axiumConcludeType);
    done();
  });
});

test('ActionController createActionController$ Mock Strategy', (done) => {
  const act = axiumLog(undefined, 200);
  act.strategy = {
    topic: 'Mock Strategy',
    actionList: [''],
    currentNode: createActionNode(act, {
      successNode: null,
      failureNode: null
    })
  };
  const cont = createActionController$(act, (controller, action) => {
    controller.fire(action);
  });
  cont.subscribe(action => {
    expect(action.type).toBe(axiumLogType);
    done();
  });
});

test('ActionController async Method Test', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [timerEmitActionQuality, mockToTrueQuality]);
  const axium = createAxium('Experiment async method creator', [experiment]);
  const plan = axium.stage('timed mock to true', [
    (_, dispatch) => {
      dispatch(strategyBegin(timedMockToTrue()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (experimentState.mock) {
        expect(experimentState.mock).toBe(true);
        plan.conclude();
        done();
      }
    }
  ]);
});

test('ActionController async Method Test with Concepts', (done) => {
  const experiment = createExperimentConcept(createExperimentState(), [timerEmitActionWithConceptsQuality, mockToTrueQuality]);
  const axium = createAxium('Experiment async method creator with Concepts', [experiment]);
  const plan = axium.stage('timed mock to true', [
    (_, dispatch) => {
      dispatch(strategyBegin(timedMockToTrueWithConcepts()), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastStrategy = selectSlice(concepts, axiumSelectLastStrategy);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (lastStrategy === timedMockToTrueWithConceptsTopic) {
        const data = selectSlice<ExperimentState>(concepts, axiumSelectLastStrategyData);
        if (data) {
          expect(data.mock).toBe(false);
          expect(experimentState.mock).toBe(true);
          plan.conclude();
          done();
        }
      }
    }
  ]);
});