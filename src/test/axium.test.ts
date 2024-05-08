/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure the Axium's ability to stitch strategies together and likewise
for the getAxiumState helper function to properly return the current axium state.
$>*/
/*<#*/
import { axiumSelectLastStrategy } from '../concepts/axium/axium.selector';
import { axiumLog } from '../concepts/axium/qualities/log.quality';
import { axium_createStitchNode } from '../concepts/axium/model/stitch.model';
import {
  ActionStrategy,
  ActionStrategyStitch,
  createActionNode,
  createActionNodeFromStrategy,
  createStrategy,
  strategyBegin
} from '../model/actionStrategy';
import { createAxium, getAxiumState } from '../model/axium';
import { selectSlice } from '../model/selector';
import { createStage } from '../model/stagePlanner';

export const yourStrategyStitch: ActionStrategyStitch = () => {
  const stepStitch = axium_createStitchNode();
  const stepOne = createActionNode(axiumLog(), {
    successNode: stepStitch,
    failureNode: null
  });
  stepOne.payload = {data: 'STITCH'};
  return [stepStitch, createStrategy({
    topic: 'Your strategy\'s topic',
    initialNode: stepOne
  })];
};

export const yourComposingStrategy = (stitch: ActionStrategyStitch): ActionStrategy => {
  const stepFinal = createActionNode(axiumLog(), {
    successNode: null,
    failureNode: null
  });
  stepFinal.payload = {data: 'FINAL'};

  const [
    stitchEnd,
    stitchStrategy
  ] = yourStrategyStitch();
  stitchEnd.successNode = stepFinal;
  const stitchHead = createActionNodeFromStrategy(stitchStrategy);

  const stepOne = createActionNode(axiumLog(), {
    successNode: stitchHead,
    failureNode: null
  });
  stepOne.payload = {data: 'BEGIN'};

  return createStrategy({
    topic: 'your composing strategy\'s topic',
    initialNode: stepOne
  });
};

test('Axium advanced usage: StrategyStitch', (done) => {
  const axium = createAxium('Test advanced usage', []);
  const strategy = yourComposingStrategy(yourStrategyStitch);
  const plan = axium.plan('Test Stitch', [
    createStage((_, dispatch) => {
      dispatch(strategyBegin(strategy), {
        iterateStage: true
      });
    }),
    createStage((concepts, _) => {
      const lastTopic = selectSlice(concepts, axiumSelectLastStrategy);
      if (lastTopic === strategy.topic) {
        expect(true).toBe(true);
        plan.conclude();
        done();
      }
    })
  ]);
});

test('Axium get axium state helper function', (done) => {
  const axium = createAxium('Test advanced usage', []);
  const plan = axium.plan('Test getAxiumState', [
    createStage((concepts, _) => {
      if (getAxiumState(concepts)) {
        expect(true).toBe(true);
        plan.conclude();
        done();
      }
    }),
  ]);
});
