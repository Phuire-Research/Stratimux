/*<$
For the asynchronous graph programming framework Stratimux, generate a test that builds a plan of three
stages where each stage dispatches the Muxium Kick and iterates into the next stage. The final stage's
kick iterates beyond the bounds of the stages array — the final kick is intentionally left "unhandled".

Prior to the Concluder Overflow hardening this advanced plan.stage past the last index, then read an
undefined stage at `const beat = plan.stages[plan.stage].beat;` (stagePlannerEntropy.ts) and threw the
runtime error "Cannot read properties of undefined (reading 'beat')".

The intended behavior is that an iterateStage or setStage advancement OUT OF THE SCOPE of the stages
array — absent an explicit conclude() — closes the plan cleanly, exactly as a trailing conclude() stage
would. This eases authorship for agents within the paradigm by removing the need to place a trailing
Concluder stage, which TypeScript's recursive type inference can refuse to accept (arbitrary type
overflow) when a preceding stage is sufficiently complex.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { CounterDeck, createCounterConcept } from '../concepts/counter/counter.concept';
jest.setTimeout(10000);

test('Stage Planner Kick Iterate Out Of Scope Concludes Cleanly', (done) => {
  let kickStagesEntered = 0;
  let reachedFinalKick = false;

  const muxium = muxification('muxium test stage planner kick iterate out of scope', {
    counter: createCounterConcept()
  }, {logging: true, storeDialog: true});

  muxium.plan<CounterDeck>('Kick Iterate Out Of Scope', ({stage, stageO}) => [
    stageO(),
    stage(({dispatch, e}) => {
      console.log('KICK STAGE 1');
      kickStagesEntered += 1;
      dispatch(e.muxiumKick(), {iterateStage: true});
    }),
    stage(({dispatch, e}) => {
      console.log('KICK STAGE 2');
      kickStagesEntered += 1;
      dispatch(e.muxiumKick(), {iterateStage: true});
    }),
    stage(({dispatch, e}) => {
      console.log('KICK STAGE 3 (final, unhandled — iterates out of scope)');
      kickStagesEntered += 1;
      reachedFinalKick = true;
      dispatch(e.muxiumKick(), {iterateStage: true});
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
