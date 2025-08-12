/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that the priority aspect of the muxium
is managing plan notifications as intended.
$>*/
/*<#*/
import { MuxiumDeck, MuxiumState } from '../../concepts/muxium/muxium.concept';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { muxification } from '../../model/muxium/muxium';
import { select } from '../../model/selector/';
import { createBaseStage, createStage } from '../../model/stagePlanner/stagePlannerHelpers';
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
  type ExperimentDeck = MuxiumDeck & {
    experiment: typeof deck.experiment
  };
  const priorityTest = muxification('Priority Test', deck, {
    logging: true,
    storeDialog: true,
    // logActionStream: true
  });

  const firstStage = (name: string, priority: number) => createBaseStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(
    ({concepts, dispatch, changes, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      console.log('HIT: ', name, changes);
      if (priorityState?.ready) {
        console.log(`${name} Priority BEGIN`);
        dispatch(d.muxium.e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, {selectors: [experimentPriorityReadySelector], priority});
  const secondStage = (name: string, newValue: number, priority: number) => createBaseStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(
    ({concepts, dispatch, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      if (priorityState) {
        console.log(`${name} Priority Base Value: `, priorityState.value);
        dispatch(d.experiment.e.experimentPriorityAddValue({newValue}), {
          iterateStage: true
        });
      }
    }, {priority});
  const thirdStage = (name: string, expected: number, priority: number) => createBaseStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(
    ({concepts, dispatch, changes, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      if (priorityState && changes.length > 0) {
        // expect(order).toBe(expectedOrder);
        console.log(`${name} Incoming Value: ${priorityState.value}, expecting: ${expected}`);
        // expect(priorityState.value).toBe(expected);
        dispatch(d.muxium.e.muxiumKick(), {
          iterateStage: true
        });
      }
    }, {selectors: [experimentPriorityValueSelector], priority});
  const concludePlan = () => createBaseStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(({stagePlanner}) => {
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