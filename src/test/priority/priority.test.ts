/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that the priority aspect of the axium
is managing plan notifications as intended.
$>*/
/*<#*/
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { createAxium } from '../../model/axium';
import { select } from '../../model/selector';
import { StagePlanner, createStage } from '../../model/stagePlanner';
import { ExperimentPriorityState, createExperimentPriorityConcept } from './priority.concept';
import { experimentPriorityReadySelector, experimentPriorityValueSelector } from './priority.selector';
import { experimentPriorityIsReady } from './qualities/isReady.quality';
import { experimentPriorityAddValue } from './qualities/addValue.quality';

test('Priority Test', (done) => {
  console.log('Priority Test');
  let concluded = 0;
  const finalize = () => {
    if (concluded === 2) {
      done();
    } else {
      concluded++;
    }
  };

  const priorityTest = createAxium('Priority Test', [
    createExperimentPriorityConcept()
  ], {logging: true, storeDialog: true, logActionStream: true});

  const firstStage = (name: string, priority: number) => createStage((concepts, dispatch, changes) => {
    const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
    console.log('HIT: ', name, changes);
    if (priorityState?.ready) {
      console.log(`${name} Priority BEGIN`);
      dispatch(axiumKick(), {
        iterateStage: true
      });
    }
  }, {selectors: [experimentPriorityReadySelector], priority});
  const secondStage = (name: string, newValue: number, priority: number) => createStage((concepts, dispatch) => {
    const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
    if (priorityState) {
      console.log(`${name} Priority Base Value: `, priorityState.value);
      dispatch(experimentPriorityAddValue({newValue}), {
        iterateStage: true
      });
    }
  }, {priority});
  const thirdStage = (name: string, expected: number, priority: number) => createStage((concepts, dispatch, changes) => {
    const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
    if (priorityState && changes.length > 0) {
      // expect(order).toBe(expectedOrder);
      console.log(`${name} Incoming Value: ${priorityState.value}, expecting: ${expected}`);
      // expect(priorityState.value).toBe(expected);
      dispatch(axiumKick(), {
        iterateStage: true
      });
    }
  }, {selectors: [experimentPriorityValueSelector], priority});
  const concludePlan = (name: string, func: () => StagePlanner) => createStage(() => {
    console.log(`${name} Priority END`);
    func().conclude();
    finalize();
  });

  const LOW = 'Low';
  const LOW_PRIORITY = 1;
  const low = priorityTest.plan(
    'Low Priority Plan', [
      firstStage(LOW, LOW_PRIORITY),
      secondStage(LOW, 1, LOW_PRIORITY),
      thirdStage(LOW, 111, LOW_PRIORITY),
      concludePlan(LOW, () => low),
    ]);
  const HIGH = 'High';
  const HIGH_PRIORITY = 100;
  const high = priorityTest.plan(
    'High Priority Plan', [
      firstStage(HIGH, HIGH_PRIORITY),
      secondStage(HIGH, 100, HIGH_PRIORITY),
      thirdStage(HIGH, 100, HIGH_PRIORITY),
      concludePlan(HIGH, () => high),
    ]);
  const MID = 'Mid';
  const MID_PRIORITY = 50;
  const mid = priorityTest.plan(
    'Mid Priority Plan', [
      firstStage(MID, MID_PRIORITY),
      secondStage(MID, 10, MID_PRIORITY),
      thirdStage(MID, 110, MID_PRIORITY),
      concludePlan(MID, () => mid),
    ]);
  setTimeout(() => {
    priorityTest.dispatch(experimentPriorityIsReady());
  }, 1000);
  priorityTest.subscribe(val => console.log('CHECK STATE: ', select.state(val, experimentName))); });
/*#>*/