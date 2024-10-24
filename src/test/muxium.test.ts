/*<$
For the asynchronous graph programming framework Stratimux, generate a test to ensure the Muxium's ability to stitch strategies together and likewise
for the getMuxiumState helper function to properly return the current muxium state.
$>*/
/*<#*/
import { muxiumSelectLastStrategy } from '../concepts/muxium/muxium.selector';
import { muxium_createStitchNode } from '../concepts/muxium/model/stitch.model';
import { muxification } from '../model/muxium/muxium';
import { selectSlice } from '../model/selector/selector';
import { createCounterConcept } from '../concepts/counter/counter.concept';
import { createAction } from '../model/action/action';
import { ActionStrategy, ActionStrategyStitch } from '../model/action/strategy/actionStrategy.type';
import { createActionNode, createActionNodeFromStrategy, createStrategy } from '../model/action/strategy/actionStrategy';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';
import { getMuxiumState } from '../model/muxium/muxiumHelpers';
import { createConcept } from '../model/concept/concept';
import { PrincipleFunction } from '../model/principle';
import { MuxiumDeck } from '../concepts/muxium/muxium.concept';

test('Muxium advanced usage: StrategyStitch', (done) => {
  const empty = {};
  muxification('base', {some: createConcept<typeof empty>('some', {}, {}, [
    (({d_}) => {
      const yourStrategyStitch: ActionStrategyStitch = () => {
        const stepStitch = muxium_createStitchNode(d_);
        const stepOne = createActionNode(createAction('logged a message passed to Muxium'), {
          successNode: stepStitch,
          failureNode: null
        });
        stepOne.payload = {data: 'STITCH'};
        return [stepStitch, createStrategy({
          topic: 'Your strategy\'s topic',
          initialNode: stepOne
        })];
      };

      const yourComposingStrategy = (stitch: ActionStrategyStitch): ActionStrategy => {
        const stepFinal = createActionNode(createAction('logged a message passed to Muxium'), {
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

        const stepOne = createActionNode(createAction('logged a message passed to Muxium'), {
          successNode: stitchHead,
          failureNode: null
        });
        stepOne.payload = {data: 'BEGIN'};

        return createStrategy({
          topic: 'your composing strategy\'s topic',
          initialNode: stepOne
        });
      };
      muxification('dummy', {});
      setTimeout(() => {
        const muxium = muxification('Test advanced usage', {counter: createCounterConcept()});
        const strategy = yourComposingStrategy(yourStrategyStitch);
        const plan = muxium.plan('Test Stitch', ({e__, stage, stageO}) => [
          stageO(() => e__.muxiumKick()),
          stage(({dispatch}) => {
            dispatch(strategyBegin(strategy), {
              iterateStage: true
            });
          }),
          stage(({concepts}) => {
            const lastTopic = selectSlice(concepts, muxiumSelectLastStrategy);
            if (lastTopic === strategy.topic) {
              expect(true).toBe(true);
              plan.conclude();
              done();
            }
          })
        ]);
      }, 1000);
    }) as PrincipleFunction<void, MuxiumDeck, typeof empty>
  ])});
});

test('Muxium get muxium state helper function', (done) => {
  const muxium = muxification('Test advanced usage', {});
  const plan = muxium.plan('Test getMuxiumState', ({stage}) => [
    stage(({concepts}) => {
      if (getMuxiumState(concepts)) {
        expect(true).toBe(true);
        plan.conclude();
        done();
      }
    }),
  ]);
});
