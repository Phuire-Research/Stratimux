/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that each possible plan options functions alongside in the muxium
$>*/
/*<#*/
import { createExperimentPlanOptionsConcept } from './newPlanOptions.concept';
import { muxification } from '../../model/muxium/muxium';
import { selectSlice } from '../../model/selector/selector';
import { experimentPlanOptionsReadySelector } from './newPlanOptions.selectors';

test('Mixed Plan Options Test', (done) => {
  const planMixedPlanOptions = muxification('Plan New Stage Priority Test', {
    experiment: createExperimentPlanOptionsConcept()
  });
  const allShouldBeTrue = [false, false, false, false, false, false, false, false];
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE One');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, { priority: 100, selectors: [experimentPlanOptionsReadySelector] }),
    stage(({stagePlanner}) => {
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
      stagePlanner.conclude();
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Two');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, { priority: 100 }),
    stage(({stagePlanner}) => {
      allShouldBeTrue[1] = true;
      stagePlanner.conclude();
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Three');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, { selectors: [experimentPlanOptionsReadySelector] }),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      allShouldBeTrue[2] = true;
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Four');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      allShouldBeTrue[3] = true;
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Five');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, {priority: 1, selectors: [experimentPlanOptionsReadySelector], beat: 1}),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      allShouldBeTrue[4] = true;
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Six');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, {priority: 1, beat: 1}),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      allShouldBeTrue[5] = true;
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Seven');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, {selectors: [experimentPlanOptionsReadySelector], beat: 1}),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      allShouldBeTrue[6] = true;
    })
  ]);
  planMixedPlanOptions.plan('Ensure that mixed plan options allow for each plan to be informed', ({stage}) => [
    stage(({concepts, dispatch, e}) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('FIRE Eight');
        dispatch(e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, {beat: 1}),
    stage(({stagePlanner}) => {
      stagePlanner.conclude();
      allShouldBeTrue[7] = true;
    })
  ]);
  planMixedPlanOptions.dispatch(planMixedPlanOptions.deck.d.experiment.e.experimentPlanOptionsIsReady());
});
/*#>*/