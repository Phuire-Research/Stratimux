/*<$
For the graph programming framework Stratimux generate a test that ensures that each possible plan options functions alongside in the axium
$>*/
/*<#*/
import { createExperimentPlanOptionsConcept } from './newPlanOptions.concept';
import { createAxium } from '../../model/axium';
import { createStage } from '../../model/stagePlanner';
import { selectSlice } from '../../model/selector';
import { experimentPlanOptionsIsReady } from './qualities/isReady.quality';
import { experimentPlanOptionsReadySelector } from './priority.selector';
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';

test('Mixed Plan Options Test', (done) => {
  const planMixedPlanOptions = createAxium('Plan New Stage Priority Test', [
    createExperimentPlanOptionsConcept()
  ]);
  const allShouldBeTrue = [false, false, false, false, false, false, false, false];
  const planOne = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE One');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, { priority: 100, selectors: [experimentPlanOptionsReadySelector] }),
    createStage(() => {
      allShouldBeTrue[0] = true;
      setTimeout(() => {
        let trueCount = 0;
        allShouldBeTrue.forEach(b => {
          if (b) {
            trueCount++;
          }
        });
        console.log('FINAL: ', allShouldBeTrue);
        expect(trueCount).toBe(allShouldBeTrue.length);
        planMixedPlanOptions.close();
        setTimeout(() => {
          done();
        }, 50);
        done();
      }, 200);
      planOne.conclude();
    })
  ]);
  const planTwo = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Two');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, { priority: 100 }),
    createStage(() => {
      allShouldBeTrue[1] = true;
      planTwo.conclude();
    })
  ]);
  const planThree = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Three');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, { selectors: [experimentPlanOptionsReadySelector] }),
    createStage(() => {
      planThree.conclude();
      allShouldBeTrue[2] = true;
    })
  ]);
  const planFour = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Four');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }),
    createStage(() => {
      planFour.conclude();
      allShouldBeTrue[3] = true;
    })
  ]);
  const planFive = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Five');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, {priority: 1, selectors: [experimentPlanOptionsReadySelector], beat: 1}),
    createStage(() => {
      planFive.conclude();
      allShouldBeTrue[4] = true;
    })
  ]);
  const planSix = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Six');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, {priority: 1, beat: 1}),
    createStage(() => {
      planSix.conclude();
      allShouldBeTrue[5] = true;
    })
  ]);
  const planSeven = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Seven');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, {selectors: [experimentPlanOptionsReadySelector], beat: 1}),
    createStage(() => {
      planSeven.conclude();
      allShouldBeTrue[6] = true;
    })
  ]);
  const planEight = planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be infomed', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Eight');
        dispatch(axiumKick(), {
          iterateStage: true
        });
      }
    }, {beat: 1}),
    createStage(() => {
      planEight.conclude();
      allShouldBeTrue[7] = true;
    })
  ]);
  planMixedPlanOptions.dispatch(experimentPlanOptionsIsReady());
});
/*#>*/