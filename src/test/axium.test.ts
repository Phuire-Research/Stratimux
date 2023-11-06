import { axiumSelectLastStrategy } from '../concepts/axium/axium.selector';
import { axiumLog } from '../concepts/axium/qualities/log.quality';
import { axium_createStitchNode } from '../concepts/axium/qualities/stitch.quality';
import {
  ActionStrategy,
  ActionStrategyStitch,
  createActionNode,
  createActionNodeFromStrategy,
  createStrategy,
  strategyBegin
} from '../model/actionStrategy';
import { createAxium } from '../model/axium';
import { selectSlice } from '../model/selector';

export const yourStrategyStitch: ActionStrategyStitch = () => {
  const stepStitch = axium_createStitchNode();
  const stepOne = createActionNode(axiumLog(), {
    successNode: stepStitch,
    failureNode: null
  });
  stepOne.payload = 'STITCH';
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
  stepFinal.payload = 'FINAL';

  const [
    stitchEnd,
    stitchStrategy
  ] = yourStrategyStitch();
  stitchEnd.successNode = stepFinal;
  // Note we are not providing options to preserve the structure of your stitched strategy.
  const stitchHead = createActionNodeFromStrategy(stitchStrategy);

  const stepOne = createActionNode(axiumLog(), {
    successNode: stitchHead,
    failureNode: null
  });
  stepOne.payload = 'BEGIN';

  return createStrategy({
    topic: 'your composing strategy\'s topic',
    initialNode: stepOne
  });
};

test('Axium advanced usage: StrategyStitch', (done) => {
  const axium = createAxium('Test advanced usage', []);
  const strategy = yourComposingStrategy(yourStrategyStitch);
  axium.stage('Test Stitch', [
    (_, dispatch) => {
      dispatch(strategyBegin(strategy), {
        iterateStage: true
      });
    },
    (concepts, _) => {
      const lastTopic = selectSlice(concepts, axiumSelectLastStrategy);
      if (lastTopic === strategy.topic) {
        expect(true).toBe(true);
        done();
      }
    }
  ]);
});
