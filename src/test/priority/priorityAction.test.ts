/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that the priority aspect of the muxium
is managing plan notifications as intended.
$>*/
/*<#*/
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { muxification } from '../../model/muxium/muxium';
import { getMuxiumState } from '../../model/muxium/muxiumHelpers';
import { select } from '../../model/selector/';
import { ExperimentPriorityState, createExperimentPriorityConcept } from './priority.concept';
import { experimentPriorityReadySelector, experimentPriorityValueSelector } from './priority.selector';
import { handlePriority } from '../../model/priority';
import { CounterState, counterName, createCounterConcept } from '../../concepts/counter/counter.concept';
import { counterSetCount } from '../../concepts/counter/qualities/setCount.quality';
import { MuxiumDeck, MuxiumState } from '../../concepts/muxium/muxium.concept';
import { MuxiumQualities } from '../../concepts/muxium/qualities';
import { createStage } from '../../model/stagePlanner/stagePlannerHelpers';

test('Priority Action Test', (done) => {
  console.log('Priority Test');
  let concluded = 0;
  const finalize = () => {
    if (concluded === 2) {
      done();
    } else {
      concluded++;
    }
  };

  const experiment = createExperimentPriorityConcept();
  type ExperimentDeck = MuxiumDeck & {
    experiment: typeof experiment,
  };
  const priorityTest = muxification('Priority Test', {
    experiment
  }, {logging: true, storeDialog: true, logActionStream: true});

  const firstStage = (name: string, priority: number) => createStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(({concepts, dispatch, changes, d}) => {
    const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
    console.log('HIT: ', name, changes);
    if (priorityState?.ready) {
      console.log(`${name} Priority BEGIN`);
      dispatch(d.muxium.e.muxiumKick(), {
        iterateStage: true
      });
    }
  }, {selectors: [experimentPriorityReadySelector], priority});
  const secondStage = (name: string, newValue: number, priority: number, override?: number) => createStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(
    ({concepts, dispatch, d}) => {
      const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
      if (priorityState) {
        console.log(`${name} Priority Base Value: `, priorityState.value);
        const action = d.experiment.e.experimentPriorityAddValue({newValue});
        if (override) {
          action.priority = override;
        }
        dispatch(action, {
          iterateStage: true
        });
      }
    }, {priority});
  const thirdStage = (name: string, expected: number, priority: number) => createStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(
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
  const concludePlan = () => createStage<unknown, ExperimentDeck, MuxiumState<MuxiumQualities, any>>(({stagePlanner}) => {
    console.log(`${stagePlanner.title} Priority END`);
    stagePlanner.conclude();
    finalize();
  });

  const LOW = 'Low';
  const LOW_PRIORITY = 1;
  priorityTest.plan(
    'Low Priority Plan', () => [
      firstStage(LOW, LOW_PRIORITY),
      secondStage(LOW, 1, LOW_PRIORITY, 1000),
      thirdStage(LOW, 111, LOW_PRIORITY),
      concludePlan(),
    ]);
  const HIGH = 'High';
  const HIGH_PRIORITY = 100;
  priorityTest.plan(
    'High Priority Plan', () => [
      firstStage(HIGH, HIGH_PRIORITY),
      secondStage(HIGH, 100, HIGH_PRIORITY),
      thirdStage(HIGH, 101, HIGH_PRIORITY),
      concludePlan(),
    ]);
  const MID = 'Mid';
  const MID_PRIORITY = 50;
  priorityTest.plan(
    'Mid Priority Plan', () => [
      firstStage(MID, MID_PRIORITY),
      secondStage(MID, 10, MID_PRIORITY),
      thirdStage(MID, 111, MID_PRIORITY),
      concludePlan(),
    ]);
  setTimeout(() => {
    priorityTest.dispatch(priorityTest.deck.d.experiment.e.experimentPriorityIsReady());
  }, 1000);
  priorityTest.subscribe(val => console.log('CHECK STATE: ', select.state(val, experimentName)));
});

type SetCount = {
  newCount: number;
}

test('Priority Action Manual Test', (done) => {
  const muxium = muxification('Priority Action Manual Muxium Extraction', {});
  const sub = muxium.subscribe(concepts => {
    sub.unsubscribe();
    muxium.close();
    const {
      muxiumKick
    } = muxium.e;
    const muxiumState = getMuxiumState(concepts);

    const {body} = muxiumState;
    const kick = muxiumKick();
    body.push(kick);
    // In production do not use the actionCreator via qualities, this is only for testing. Otherwise we would need to prime these semaphores
    const one = counterSetCount.actionCreator({
      newCount: 1
    }, {priority: 100});
    const two = counterSetCount.actionCreator({
      newCount: 2
    }, {priority: 50});
    const three = counterSetCount.actionCreator({
      newCount: 3
    }, {priority: 75});
    const four = counterSetCount.actionCreator({
      newCount: 4
    }, {priority: 25});
    handlePriority(muxiumState, one);
    expect(body[0].type).toBe(one.type);
    expect(body[1].type).toBe(kick.type);
    handlePriority(muxiumState, two);
    handlePriority(muxiumState, three);
    handlePriority(muxiumState, four);
    expect(select.payload<SetCount>(body[0]).newCount).toBe(select.payload<SetCount>(one).newCount);
    expect(select.payload<SetCount>(body[1]).newCount).toBe(select.payload<SetCount>(three).newCount);
    expect(select.payload<SetCount>(body[2]).newCount).toBe(select.payload<SetCount>(two).newCount);
    expect(select.payload<SetCount>(body[3]).newCount).toBe(select.payload<SetCount>(four).newCount);
    expect(body[4].type).toBe(kick.type);
    done();
  });
});

test('Priority Action Close Test', (done) => {
  const muxium = muxification('Priority Action Manual Muxium Extraction', {counter: createCounterConcept()});
  const sub = muxium.subscribe(concepts => {
    sub.unsubscribe();
    const muxiumState = getMuxiumState(concepts);
    const {
      muxiumLog,
      muxiumKick
    } = muxium.e;

    const {head, body} = muxiumState;
    if (head.length === 0) {
      head.push(muxiumLog());
    }
    const kick = muxiumKick();
    body.push(kick);
    // In production do not use the actionCreator via qualities, this is only for testing. Otherwise we would need to prime these semaphores
    const one = counterSetCount.actionCreator({
      newCount: 1
    }, {priority: 100});
    const two = counterSetCount.actionCreator({
      newCount: 2
    }, {priority: 50});
    const three = counterSetCount.actionCreator({
      newCount: 3
    }, {priority: 75});
    const four = counterSetCount.actionCreator({
      newCount: 4
    }, {priority: 25});
    handlePriority(muxiumState, one);
    expect(body[0].type).toBe(one.type);
    expect(body[1].type).toBe(kick.type);
    handlePriority(muxiumState, two);
    handlePriority(muxiumState, three);
    handlePriority(muxiumState, four);
    expect(select.payload<SetCount>(body[0]).newCount).toBe(select.payload<SetCount>(one).newCount);
    expect(select.payload<SetCount>(body[1]).newCount).toBe(select.payload<SetCount>(three).newCount);
    expect(select.payload<SetCount>(body[2]).newCount).toBe(select.payload<SetCount>(two).newCount);
    expect(select.payload<SetCount>(body[3]).newCount).toBe(select.payload<SetCount>(four).newCount);
    expect(body[4].type).toBe(kick.type);
    let dispatched = false;
    muxium.subscribe(cpts => {
      if (!dispatched) {
        dispatched = true;
        const preClose = muxium.e.muxiumPreClose({
          exit: false
        });
        preClose.priority = 100000;
        muxium.dispatch(preClose);
      }
      expect(select.state<CounterState>(cpts, counterName)?.count).toBe(0);
      if (!dispatched) {
        setTimeout(() => {
          done();
        }, 100);
      }
    });
    done();
  });
});
/*#>*/