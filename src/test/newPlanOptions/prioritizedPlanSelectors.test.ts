/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that each possible plan options functions alongside in the muxium
$>*/
/*<#*/
import { createExperimentPlanOptionsConcept } from './newPlanOptions.concept';
import { muxification, getMuxiumState } from '../../model/muxium';
import { createStage } from '../../model/stagePlanner';
import { selectSlice } from '../../model/selector';
import { experimentPlanOptionsIsReady } from './qualities/isReady.quality';
import { muxiumKick } from '../../concepts/muxium/qualities/kick.quality';
import { muxiumSelectOpen } from '../../concepts/muxium/muxium.selector';
jest.setTimeout(30000);
test('prioritized plans with selectors Test', (done) => {
  const planPrioritizedSelectors = muxification('Plan New Stage Priority Test', {
    experiment: createExperimentPlanOptionsConcept()
  });
  const num = 100;
  const allShouldBeTrue = new Array(num).fill(false);
  const stressTest = (id: number) => {
    // console.log('INIT ', id);
    planPrioritizedSelectors.plan('Ensure that prioritized plans with selectors allow for each plan to be informed',
      ({stage}) => [
        stage(({concepts, dispatch, e}) => {
          if (selectSlice(concepts, muxiumSelectOpen)) {
            // console.log(`FIRE ${id}`, allShouldBeTrue, getMuxiumState(concepts).open);
            dispatch(e.muxiumKick(), {
              iterateStage: true
            });
          }
        }, { priority: (num + 1) - id, selectors: [muxiumSelectOpen] }),
        stage(({stagePlanner}) => {
          allShouldBeTrue[id] = true;
          stagePlanner.conclude();
        })
      ]
    );
  };
  allShouldBeTrue.forEach((_, id) => stressTest(id));
  planPrioritizedSelectors.dispatch(planPrioritizedSelectors.deck.d.experiment.e.experimentPlanOptionsIsReady());
  setTimeout(() => {
    let trueCount = 0;
    allShouldBeTrue.forEach(b => {
      if (b) {
        trueCount++;
      }
    });
    // console.log('FINAL: ', allShouldBeTrue);
    expect(trueCount).toBe(allShouldBeTrue.length);
    planPrioritizedSelectors.close();
    setTimeout(() => {
      done();
    }, 50);
  }, 2000);
});
/*#>*/