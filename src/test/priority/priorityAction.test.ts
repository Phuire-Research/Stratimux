/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that the priority aspect of the axium
is managing plan notifications as intended.
$>*/
/*<#*/
import { axiumKick } from '../../concepts/axium/qualities/kick.quality';
import { experimentName } from '../../concepts/experiment/experiment.concept';
import { createAxium, getAxiumState } from '../../model/axium';
import { select, selectPayload, selectState } from '../../model/selector';
import { StagePlanner, createStage } from '../../model/stagePlanner';
import { ExperimentPriorityState, createExperimentPriorityConcept } from './priority.concept';
import { experimentPriorityReadySelector, experimentPriorityValueSelector } from './priority.selector';
import { experimentPriorityIsReady } from './qualities/isReady.quality';
import { experimentPriorityAddValue } from './qualities/addValue.quality';
import { handlePriority } from '../../model/priority';
import { counterSetCount } from '../../concepts/counter/qualities/setCount.quality';
import { axiumTimeOut } from '../../model/time';
import { axiumPreClose } from '../../concepts/axium/qualities/preClose.quality';
import { axiumLog } from '../../concepts/axium/qualities/log.quality';
import { CounterState, counterName, createCounterConcept } from '../../concepts/counter/counter.concept';

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
  const secondStage = (name: string, newValue: number, priority: number, override?: number) => createStage((concepts, dispatch) => {
    const priorityState = select.state<ExperimentPriorityState>(concepts, experimentName);
    if (priorityState) {
      console.log(`${name} Priority Base Value: `, priorityState.value);
      const action = experimentPriorityAddValue({newValue});
      if (override) {
        action.priority = override;
      }
      dispatch(action, {
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
      secondStage(LOW, 1, LOW_PRIORITY, 1000),
      thirdStage(LOW, 111, LOW_PRIORITY),
      concludePlan(LOW, () => low),
    ]);
  const HIGH = 'High';
  const HIGH_PRIORITY = 100;
  const high = priorityTest.plan(
    'High Priority Plan', [
      firstStage(HIGH, HIGH_PRIORITY),
      secondStage(HIGH, 100, HIGH_PRIORITY),
      thirdStage(HIGH, 101, HIGH_PRIORITY),
      concludePlan(HIGH, () => high),
    ]);
  const MID = 'Mid';
  const MID_PRIORITY = 50;
  const mid = priorityTest.plan(
    'Mid Priority Plan', [
      firstStage(MID, MID_PRIORITY),
      secondStage(MID, 10, MID_PRIORITY),
      thirdStage(MID, 111, MID_PRIORITY),
      concludePlan(MID, () => mid),
    ]);
  setTimeout(() => {
    priorityTest.dispatch(experimentPriorityIsReady());
  }, 1000);
  priorityTest.subscribe(val => console.log('CHECK STATE: ', select.state(val, experimentName)));
});

type SetCount = {
  newCount: number;
}

test('Priority Action Manual Test', (done) => {
  const axium = createAxium('Priority Action Manual Axium Extraction', []);
  const sub = axium.subscribe(concepts => {
    sub.unsubscribe();
    axium.close();
    const axiumState = getAxiumState(concepts);

    const {body} = axiumState;
    const kick = axiumKick();
    body.push(kick);
    const one = counterSetCount({
      newCount: 1
    }, {priority: 100});
    const two = counterSetCount({
      newCount: 2
    }, {priority: 50});
    const three = counterSetCount({
      newCount: 3
    }, {priority: 75});
    const four = counterSetCount({
      newCount: 4
    }, {priority: 25});
    handlePriority(axiumState, one);
    expect(body[0].type).toBe(one.type);
    expect(body[1].type).toBe(kick.type);
    handlePriority(axiumState, two);
    handlePriority(axiumState, three);
    handlePriority(axiumState, four);
    expect(selectPayload<SetCount>(body[0]).newCount).toBe(selectPayload<SetCount>(one).newCount);
    expect(selectPayload<SetCount>(body[1]).newCount).toBe(selectPayload<SetCount>(three).newCount);
    expect(selectPayload<SetCount>(body[2]).newCount).toBe(selectPayload<SetCount>(two).newCount);
    expect(selectPayload<SetCount>(body[3]).newCount).toBe(selectPayload<SetCount>(four).newCount);
    expect(body[4].type).toBe(kick.type);
    done();
  });
});

test('Priority Action Close Test', (done) => {
  const axium = createAxium('Priority Action Manual Axium Extraction', [createCounterConcept()]);
  const sub = axium.subscribe(concepts => {
    sub.unsubscribe();
    const axiumState = getAxiumState(concepts);

    const {head, body} = axiumState;
    if (head.length === 0) {
      head.push(axiumLog());
    }
    const kick = axiumKick();
    body.push(kick);
    const one = counterSetCount({
      newCount: 1
    }, {priority: 100});
    const two = counterSetCount({
      newCount: 2
    }, {priority: 50});
    const three = counterSetCount({
      newCount: 3
    }, {priority: 75});
    const four = counterSetCount({
      newCount: 4
    }, {priority: 25});
    handlePriority(axiumState, one);
    expect(body[0].type).toBe(one.type);
    expect(body[1].type).toBe(kick.type);
    handlePriority(axiumState, two);
    handlePriority(axiumState, three);
    handlePriority(axiumState, four);
    expect(selectPayload<SetCount>(body[0]).newCount).toBe(selectPayload<SetCount>(one).newCount);
    expect(selectPayload<SetCount>(body[1]).newCount).toBe(selectPayload<SetCount>(three).newCount);
    expect(selectPayload<SetCount>(body[2]).newCount).toBe(selectPayload<SetCount>(two).newCount);
    expect(selectPayload<SetCount>(body[3]).newCount).toBe(selectPayload<SetCount>(four).newCount);
    expect(body[4].type).toBe(kick.type);
    let dispatched = false;
    axium.subscribe(cpts => {
      if (!dispatched) {
        dispatched = true;
        const preClose = axiumPreClose({
          exit: false
        });
        preClose.priority = 100000;
        axium.dispatch(preClose);
      }
      expect(selectState<CounterState>(cpts, counterName)?.count).toBe(0);
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