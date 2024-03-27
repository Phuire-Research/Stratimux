/*<$
For the graph programming framework Stratimux generate a test that ensures that users can set new selectors for their stages and another
test to ensure that they can change the priority of their stages and again for beat
$>*/
/*<#*/
import { createExperimentPlanOptionsConcept } from './newPlanOptions.concept';
import { createAxium } from '../../model/axium';
import { createStage } from '../../model/stagePlanner';
import { KeyedSelector, selectSlice } from '../../model/selector';
import { planOptionsSelect } from './newPlanOptions.selectors';
import { experimentToggleAllSeven } from './qualities/toggleAllSeven.quality';
import { experimentPlanOptionsAddValue } from './qualities/addValue.quality';
import { experimentPlanOptionsIsReady } from './qualities/isReady.quality';
import { experimentPlanOptionsReadySelector } from './priority.selector';

test('New Plan Options Selector Test', (done) => {
  const planNewStageSelectors = createAxium('Plan New Stage Selectors Test', [
    createExperimentPlanOptionsConcept()
  ]);
  let count = 0;
  const plan = planNewStageSelectors.plan('Ensure New Selectors Can be set on a single stage', [
    createStage((_, dispatch, changes) => {
      // First run will be all
      const selectors: KeyedSelector[] = [];
      let final = false;
      if (count === 0) {
        selectors.push(planOptionsSelect.one);
        expect(changes?.length).toBe(0);
      } else if (count === 1) {
        selectors.push(planOptionsSelect.one);
        selectors.push(planOptionsSelect.two);
        expect(changes?.length).toBe(1);
      } else if (count === 2) {
        selectors.push(planOptionsSelect.one);
        selectors.push(planOptionsSelect.two);
        selectors.push(planOptionsSelect.three);
        expect(changes?.length).toBe(2);
      } else if (count === 3) {
        selectors.push(planOptionsSelect.one);
        selectors.push(planOptionsSelect.two);
        selectors.push(planOptionsSelect.three);
        selectors.push(planOptionsSelect.four);
        expect(changes?.length).toBe(3);
      } else if (count === 4) {
        selectors.push(planOptionsSelect.one);
        selectors.push(planOptionsSelect.two);
        selectors.push(planOptionsSelect.three);
        selectors.push(planOptionsSelect.four);
        selectors.push(planOptionsSelect.five);
        expect(changes?.length).toBe(4);
      } else if (count === 5) {
        selectors.push(planOptionsSelect.one);
        selectors.push(planOptionsSelect.two);
        selectors.push(planOptionsSelect.three);
        selectors.push(planOptionsSelect.four);
        selectors.push(planOptionsSelect.five);
        selectors.push(planOptionsSelect.six);
        expect(changes?.length).toBe(5);
      } else if (count === 6) {
        selectors.push(planOptionsSelect.one);
        selectors.push(planOptionsSelect.two);
        selectors.push(planOptionsSelect.three);
        selectors.push(planOptionsSelect.four);
        selectors.push(planOptionsSelect.five);
        selectors.push(planOptionsSelect.six);
        selectors.push(planOptionsSelect.seven);
        expect(changes?.length).toBe(6);
      } else {
        expect(changes?.length).toBe(7);
        final = true;
      }

      console.log(`Run: ${count}`);
      count++;
      if (final) {
        dispatch(experimentToggleAllSeven(), {
          newSelectors: selectors,
          throttle: 0,
          iterateStage: true
        });
      } else {
        dispatch(experimentToggleAllSeven(), {
          newSelectors: selectors,
          throttle: 0
        });
      }
    }),
    createStage(() => {
      console.log(`Run: ${count}`);
      plan.conclude();
      planNewStageSelectors.close();
      setTimeout(() => {
        done();
      }, 50);
    })
  ]);
});

// [TESTING NOTE]
// Interesting note about this test and jest, if the expect doesn't line up, the underlying implementation fowls up the processing order,
// As if you set the tests to explicitly fail, the third stage will repeat over and over again despite the iterateStage...
test('New Plan Options Priority Test', (done) => {
  const planNewStagePriority = createAxium('Plan New Stage Priority Test', [
    createExperimentPlanOptionsConcept()
  ]);
  let count = 0;
  let planOneCount = 0;
  const planOne = planNewStagePriority.plan('Ensure New Priority Can be set on a single stage', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('Plan 1 Count: ', count, planOneCount);
        if (planOneCount === 0) {
          planOneCount++;
          count++;
          expect(count).toBe(1);
          dispatch(experimentPlanOptionsAddValue({
            newValue: 100,
          }), {
            throttle: 0,
            newPriority: 2
          });
        } else {
          planOneCount++;
          count++;
          expect(count).toBe(6);
          dispatch(experimentPlanOptionsAddValue({
            newValue: 100,
          }), {
            throttle: 0,
            iterateStage: true,
          });
        }
      }
    }, undefined, 100),
    createStage(() => {
      planOne.conclude();
      setTimeout(() => {
        console.log('Test Conclude');
        planNewStagePriority.close();
        done();
      }, 100);
    })
  ]);

  let planTwoCount = 0;
  const planTwo = planNewStagePriority.plan('Ensure New Priority Can be set on a single stage', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('Plan 2 Count: ', count, planTwoCount);
        if (planTwoCount === 0) {
          planTwoCount++;
          count++;
          expect(count).toBe(2);
          dispatch(experimentPlanOptionsAddValue({
            newValue: 50,
          }), {
            throttle: 0,
            newPriority: 3
          });
        } else {
          planTwoCount++;
          count++;
          expect(count).toBe(5);
          dispatch(experimentPlanOptionsAddValue({
            newValue: 50,
          }), {
            throttle: 0,
            iterateStage: true
          });
        }
      }
    }, undefined, 50),
    createStage(() => {
      planTwo.conclude();
    })
  ]);

  let planThreeCount = 0;
  const planThree = planNewStagePriority.plan('Ensure New Priority Can be set on a single stage', [
    createStage((concepts, dispatch) => {
      if (selectSlice(concepts, experimentPlanOptionsReadySelector)) {
        console.log('Plan 3 Count: ', count, planThreeCount);
        if (planThreeCount === 0) {
          planThreeCount++;
          count++;
          expect(count).toBe(3);
          dispatch(experimentPlanOptionsAddValue({
            newValue: 50,
          }), {
            throttle: 0,
            newPriority: 5
          });
        } else {
          planThreeCount++;
          count++;
          expect(count).toBe(4);
          dispatch(experimentPlanOptionsAddValue({
            newValue: 50,
          }), {
            throttle: 0,
            iterateStage: true
          });
        }
      }
    }, undefined, 5),
    createStage(() => {
      planThree.conclude();
    })
  ]);
  planNewStagePriority.dispatch(experimentPlanOptionsIsReady());
});
/*#>*/