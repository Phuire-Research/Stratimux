/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that each possible plan options functions alongside in the axium
$>*/
/*<#*/
import { createExperimentPlanOptionsConcept } from './newPlanOptions.concept';
import { createAxium, getAxiumState } from '../../model/axium';
import { createStage } from '../../model/stagePlanner';
import { selectSlice } from '../../model/selector';
import { experimentPlanOptionsIsReady } from './qualities/isReady.quality';
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { axiumSelectOpen } from '../../concepts/axium/axium.selector';
jest.setTimeout(30000);
test('prioritized plans with selectors Test', (done) => {
  const planPrioritizedSelectors = createAxium('Plan New Stage Priority Test', {
    experiment: createExperimentPlanOptionsConcept()
  });
  const num = 100;
  const allShouldBeTrue = new Array(num).fill(false);
  const stressTest = (id: number) => {
    console.log('INIT ', id);
    planPrioritizedSelectors.plan('Ensure that prioritized plans with selectors allow for each plan to be informed',
      ({stage}) => [
        stage(({concepts, dispatch}) => {
          if (selectSlice(concepts, axiumSelectOpen)) {
            console.log(`FIRE ${id}`, allShouldBeTrue, getAxiumState(concepts).open);
            dispatch(axiumKick(), {
              iterateStage: true
            });
          }
        }, { priority: (num + 1) - id, selectors: [axiumSelectOpen] }),
        stage(({stagePlanner}) => {
          allShouldBeTrue[id] = true;
          stagePlanner.conclude();
        })
      ]
    );
  };
  allShouldBeTrue.forEach((_, id) => stressTest(id));
  planPrioritizedSelectors.dispatch(experimentPlanOptionsIsReady());
  setTimeout(() => {
    let trueCount = 0;
    allShouldBeTrue.forEach(b => {
      if (b) {
        trueCount++;
      }
    });
    console.log('FINAL: ', allShouldBeTrue);
    expect(trueCount).toBe(allShouldBeTrue.length);
    planPrioritizedSelectors.close();
    setTimeout(() => {
      done();
    }, 5000);
    done();
  }, 2000);
});
/*#>*/