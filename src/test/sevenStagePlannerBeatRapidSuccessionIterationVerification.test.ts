/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures a stage planner
carrying seven stages, each with its own beat timer, can iterate through all stages in rapid succession
and engage each stage exactly once without debounce collision. This guards against the failure mode where
a beat-armed setTimeout from a prior stage fires after iterateStage has advanced the plan, executing the
old stage's function with the new stage's plan.beat — producing non-deterministic stage iteration.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { CounterDeck, createCounterConcept } from '../concepts/counter/counter.concept';

jest.setTimeout(10000);

const sevenStageBeatRapidFireInterval = 50;

test('Seven Stage Planner Beat Rapid Succession Each Stage Iterates Once Without Debounce Collision', (done) => {
  const sevenStageEngagementOnceEachTallyArray: [number, number, number, number, number, number, number] =
    [0, 0, 0, 0, 0, 0, 0];

  const muxium = muxification('seven stage planner beat rapid succession iteration verification', {
    counter: createCounterConcept()
  }, { logging: true, storeDialog: true });

  const plan = muxium.plan<CounterDeck>(
    'Seven Stage Planner Beat Rapid Succession Iteration Verification',
    ({ stage, stageO }) => [
      // Index 0 — stageO guard: waits for muxium open, then iterates without beat
      stageO(),
      // Index 1 — firstBeatRegistrationCounterIncrementInitiated
      stage(({ dispatch, d }) => {
        sevenStageEngagementOnceEachTallyArray[0] += 1;
        dispatch(d.counter.e.counterAdd(), { iterateStage: true });
      }, { beat: sevenStageBeatRapidFireInterval }),
      // Index 2 — secondBeatAccumulationCounterIncrementAdvanced
      stage(({ dispatch, d }) => {
        sevenStageEngagementOnceEachTallyArray[1] += 1;
        dispatch(d.counter.e.counterAdd(), { iterateStage: true });
      }, { beat: sevenStageBeatRapidFireInterval }),
      // Index 3 — thirdBeatContinuationCounterIncrementSustained
      stage(({ dispatch, d }) => {
        sevenStageEngagementOnceEachTallyArray[2] += 1;
        dispatch(d.counter.e.counterAdd(), { iterateStage: true });
      }, { beat: sevenStageBeatRapidFireInterval }),
      // Index 4 — fourthBeatPersistenceCounterIncrementMaintained
      stage(({ dispatch, d }) => {
        sevenStageEngagementOnceEachTallyArray[3] += 1;
        dispatch(d.counter.e.counterAdd(), { iterateStage: true });
      }, { beat: sevenStageBeatRapidFireInterval }),
      // Index 5 — fifthBeatResolutionCounterIncrementApproachingFinal
      stage(({ dispatch, d }) => {
        sevenStageEngagementOnceEachTallyArray[4] += 1;
        dispatch(d.counter.e.counterAdd(), { iterateStage: true });
      }, { beat: sevenStageBeatRapidFireInterval }),
      // Index 6 — sixthBeatPenultimateCounterIncrementSustained
      stage(({ dispatch, d }) => {
        sevenStageEngagementOnceEachTallyArray[5] += 1;
        dispatch(d.counter.e.counterAdd(), { iterateStage: true });
      }, { beat: sevenStageBeatRapidFireInterval }),
      // Index 7 — seventhBeatCompletionCounterFinalValueAssertedAndPlanConcluded
      stage(({ d, stagePlanner }) => {
        sevenStageEngagementOnceEachTallyArray[6] += 1;
        const finalCount = d.counter.k.count.select();
        console.log('SEVEN STAGE FINAL COUNT:', finalCount);
        console.log('SEVEN STAGE TALLY:', sevenStageEngagementOnceEachTallyArray);
        expect(finalCount).toBe(6);
        expect(sevenStageEngagementOnceEachTallyArray).toEqual([1, 1, 1, 1, 1, 1, 1]);
        stagePlanner.conclude();
        muxium.close();
        setTimeout(() => done(), 500);
      }, { beat: sevenStageBeatRapidFireInterval })
    ]);
});
/*#>*/
