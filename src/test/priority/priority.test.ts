/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that the priority aspect of the axium
is managing plan notifications as intended.
$>*/
/*<#*/
import { AxiumDeck } from '../../concepts/axium/axium.concept';
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { createAxium } from '../../model/axium';
import { select } from '../../model/selector';
import { createStage } from '../../model/stagePlanner';
import { ExperimentPriorityState, createExperimentPriorityConcept } from './priority.concept';
import { experimentPriorityReadySelector, experimentPriorityValueSelector } from './priority.selector';

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
  const deck = {
    experiment: createExperimentPriorityConcept()
  };
  type ExperimentDeck = AxiumDeck & {
    experiment: typeof deck.experiment
  };
  const priorityTest = createAxium('Priority Test', deck, {logging: true, storeDialog: true, logActionStream: true});

  const firstStage = (name: string, priority: number) => createStage<unknown, ExperimentDeck>(
    ({concepts, dispatch, changes, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      console.log('HIT: ', name, changes);
      if (priorityState?.ready) {
        console.log(`${name} Priority BEGIN`);
        dispatch(d.axium.e.axiumKick(), {
          iterateStage: true
        });
      }
    }, {selectors: [experimentPriorityReadySelector], priority});
  const secondStage = (name: string, newValue: number, priority: number) => createStage<unknown, ExperimentDeck>(
    ({concepts, dispatch, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      if (priorityState) {
        console.log(`${name} Priority Base Value: `, priorityState.value);
        dispatch(d.experiment.e.experimentPriorityAddValue({newValue}), {
          iterateStage: true
        });
      }
    }, {priority});
  const thirdStage = (name: string, expected: number, priority: number) => createStage<unknown, ExperimentDeck>(
    ({concepts, dispatch, changes, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      if (priorityState && changes.length > 0) {
        // expect(order).toBe(expectedOrder);
        console.log(`${name} Incoming Value: ${priorityState.value}, expecting: ${expected}`);
        // expect(priorityState.value).toBe(expected);
        dispatch(d.axium.e.axiumKick(), {
          iterateStage: true
        });
      }
    }, {selectors: [experimentPriorityValueSelector], priority});
  const concludePlan = () => createStage<unknown, ExperimentDeck>(({stagePlanner}) => {
    console.log(`${stagePlanner.title} Priority END`);
    stagePlanner.conclude();
    finalize();
  });

  const LOW = 'Low';
  const LOW_PRIORITY = 1;
  priorityTest.plan(
    'Low Priority Plan', () => [
      firstStage(LOW, LOW_PRIORITY),
      secondStage(LOW, 1, LOW_PRIORITY),
      thirdStage(LOW, 111, LOW_PRIORITY),
      concludePlan(),
    ]);
  const HIGH = 'High';
  const HIGH_PRIORITY = 100;
  priorityTest.plan(
    'High Priority Plan', () => [
      firstStage(HIGH, HIGH_PRIORITY),
      secondStage(HIGH, 100, HIGH_PRIORITY),
      thirdStage(HIGH, 100, HIGH_PRIORITY),
      concludePlan(),
    ]);
  const MID = 'Mid';
  const MID_PRIORITY = 50;
  priorityTest.plan(
    'Mid Priority Plan', () => [
      firstStage(MID, MID_PRIORITY),
      secondStage(MID, 10, MID_PRIORITY),
      thirdStage(MID, 110, MID_PRIORITY),
      concludePlan(),
    ]);
  setTimeout(() => {
    priorityTest.dispatch(priorityTest.deck.d.experiment.e.experimentPriorityIsReady());
  }, 1000);
  priorityTest.subscribe(val => console.log('CHECK STATE: ', select.state(val, experimentName))); });
/*#>*/