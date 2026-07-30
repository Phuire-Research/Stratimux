/*<$
For the asynchronous graph programming framework Stratimux, generate a test that sandwiches an
"invalidating" plan — one that concludes by iterating OUT OF SCOPE of its stages array — between two
adjacent plans that each iterate a counter to conclusion via the conclude pattern.

Plan A and Plan C iterate the counter with NO expected value; they simply run to conclusion and end with
stage(({stagePlanner}) => stagePlanner.conclude()). Plan B (sandwiched, registered second) kicks through
its stages and, on its final unhandled kick, advances out of scope — the Concluder Overflow path that
calls deletePlan mid-flight of the other two plans.

The concern this test rules out: deletePlan re-runs manageQues, which re-indexes the plan queues. If
removing Plan B mid-flight altered the stage placement of the adjacent Plans A and C, one or both would
stall and never reach conclusion. When all three plans conclude, Jest done() fires — proving the
out-of-scope conclusion of one plan does not disturb the stage placement of adjacent plans.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { CounterDeck, createCounterConcept } from '../concepts/counter/counter.concept';
jest.setTimeout(10000);

test('Sandwiched Out Of Scope Conclusion Does Not Disrupt Adjacent Plans', (done) => {
  const concluded = new Set<string>();
  let finished = false;

  const muxium = muxification('muxium test sandwiched out of scope', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});

  const concludePlan = (id: string) => {
    concluded.add(id);
    if (concluded.size === 3 && !finished) {
      finished = true;
      setTimeout(() => {
        muxium.close();
        done();
      }, 200);
    }
  };

  // Plan A — iterates the counter to conclusion (no expected value), concludes via the conclude pattern.
  muxium.plan<CounterDeck>('Counter Plan A', ({stage, stageO}) => [
    stageO(),
    stage(({dispatch, d}) => { dispatch(d.counter.e.counterAdd(), {iterateStage: true}); }),
    stage(({dispatch, d}) => { dispatch(d.counter.e.counterAdd(), {iterateStage: true}); }),
    stage(({dispatch, d}) => { dispatch(d.counter.e.counterAdd(), {iterateStage: true}); }),
    stage(({stagePlanner}) => {
      console.log('PLAN A CONCLUDE');
      concludePlan('A');
      stagePlanner.conclude();
    })
  ]);

  // Plan B — the invalidating plan: kicks through its stages, final unhandled kick iterates OUT OF SCOPE.
  muxium.plan<CounterDeck>('Out Of Scope Plan B', ({stage, stageO}) => [
    stageO(),
    stage(({dispatch, e}) => { dispatch(e.muxiumKick(), {iterateStage: true}); }),
    stage(({dispatch, e}) => { dispatch(e.muxiumKick(), {iterateStage: true}); }),
    stage(({dispatch, e}) => {
      console.log('PLAN B OUT OF SCOPE CONCLUDE');
      concludePlan('B');
      dispatch(e.muxiumKick(), {iterateStage: true});
    })
  ]);

  // Plan C — iterates the counter to conclusion (no expected value), concludes via the conclude pattern.
  muxium.plan<CounterDeck>('Counter Plan C', ({stage, stageO}) => [
    stageO(),
    stage(({dispatch, d}) => { dispatch(d.counter.e.counterAdd(), {iterateStage: true}); }),
    stage(({dispatch, d}) => { dispatch(d.counter.e.counterAdd(), {iterateStage: true}); }),
    stage(({dispatch, d}) => { dispatch(d.counter.e.counterAdd(), {iterateStage: true}); }),
    stage(({stagePlanner}) => {
      console.log('PLAN C CONCLUDE');
      concludePlan('C');
      stagePlanner.conclude();
    })
  ]);
});
/*#>*/
