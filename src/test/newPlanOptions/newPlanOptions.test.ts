/*<$
For the graph programming framework Stratimux generate a test that ensures that users can set new selectors for their stages and another
test to ensure that they can change the priority of their stages and again for beat
$>*/
/*<#*/
import { createExperimentPlanOptionsConcept } from './newPlanOptions.concept';
import { createAxium } from '../../model/axium';
import { createStage } from '../../model/stagePlanner';
import { KeyedSelector } from '../../model/selector';
import { planOptionsSelect } from './newPlanOptions.selectors';
import { experimentToggleAllSeven } from './qualities/toggleAllSeven.quality';

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
/*#>*/