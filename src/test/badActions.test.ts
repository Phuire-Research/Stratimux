/*<$
For the asynchronous graph programming framework Stratimux, generate a test to demonstrate the effectiveness of semaphores and bad actions.
$>*/
/*<#*/
import { createCounterConcept } from '../concepts/counter/counter.concept';
import { createAction } from '../model/action/action';
import { muxification } from '../model/muxium/muxium';

test('Test bad actions functionality', (done) => {
  const muxium = muxification('Mock Muxium', {counter: createCounterConcept()}, {
    logging: true
  });
  muxium.plan('Check Concepts', ({stage, stageO, d__}) => [
    stageO(),
    stage(({dispatch}) => {
      dispatch(createAction('Will be a bad action'), {
        iterateStage: true
      });
    }),
    stage(({k, stagePlanner}) => {
      expect(k.badActions.select().length).toBe(1);
      stagePlanner.conclude();
      setTimeout(() => {
        done();
      }, 500);
    })
  ]);
});

/*#>*/