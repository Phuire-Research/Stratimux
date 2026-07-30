/*<$
For the asynchronous graph programming framework Stratimux, generate the setStage variant of the Kick
Iterate Out Of Scope test. Three stages each dispatch the Muxium Kick and use setStage to jump into the
next stage; the final stage uses setStage to target an index beyond the bounds of the stages array — the
final hop is intentionally left "unhandled".

Where iterateStage advances by one (plan.stage + 1), setStage jumps to an explicit index. Both flow
through the same `next !== -1` branch of _dispatch, so the Concluder Overflow hardening must close the
plan cleanly for an out-of-scope setStage exactly as it does for an out-of-scope iterateStage — rather
than reading an undefined stage (.beat / .priority) and throwing at runtime.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { CounterDeck, createCounterConcept } from '../concepts/counter/counter.concept';
jest.setTimeout(10000);

test('Stage Planner Kick SetStage Out Of Scope Concludes Cleanly', (done) => {
  let kickStagesEntered = 0;
  let reachedFinalKick = false;

  const muxium = muxification('muxium test stage planner kick setStage out of scope', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});

  muxium.plan<CounterDeck>('Kick SetStage Out Of Scope', ({stage, stageO}) => [
    stageO(),
    stage(({dispatch, e}) => {
      console.log('SETSTAGE KICK 1 -> 2');
      kickStagesEntered += 1;
      dispatch(e.muxiumKick(), {setStage: 2});
    }),
    stage(({dispatch, e}) => {
      console.log('SETSTAGE KICK 2 -> 3');
      kickStagesEntered += 1;
      dispatch(e.muxiumKick(), {setStage: 3});
    }),
    stage(({dispatch, e}) => {
      console.log('SETSTAGE KICK 3 -> 4 (out of scope)');
      kickStagesEntered += 1;
      reachedFinalKick = true;
      dispatch(e.muxiumKick(), {setStage: 4});
    })
  ]);

  setTimeout(() => {
    expect(kickStagesEntered).toBe(3);
    expect(reachedFinalKick).toBe(true);
    muxium.close();
    setTimeout(() => done(), 100);
  }, 1000);
});
/*#>*/
