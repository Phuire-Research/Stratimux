/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures qualities are being created with actions.
And ensure that the semaphore is being set via the Muxium for the actions created using said qualities.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { createQualityCard, createQualityCardWithPayload } from '../model/quality';
import { Concept, Concepts, createConcept } from '../model/concept/concept';
import { Actions } from '../model/action/action.type';

test('Quality Actions', (done) => {
  const something = createQualityCard({
    type: 'Something',
    reducer: (state) => state
  });
  type payload = {
    here: number;
  };

  const initialState = {};
  const some = createQualityCardWithPayload<typeof initialState, payload>({
    type: 'Some',
    reducer: (state) => state
  });
  const qs = {
    something,
    some
  };
  // Have what I need
  something.actionCreator();
  some.actionCreator({
    here: 12
  });
  // Now just make it work
  expect(qs.something.actionType).toBe(something.actionType);

  const f = (actions: Actions<typeof qs>) => {
    actions.some({
      here: 1
    });
    return actions.something();
  };
  const c = createConcept<typeof initialState, typeof qs>('Some', initialState, qs, [
    ({e_}) => {
      console.log('HIT PRINCIPLE', e_.some({
        here: 2
      }));
      expect(e_.something().type).toBe('Something');
    }
  ]) as Concept<typeof initialState, typeof qs>;
  c.actions.something;
  c.actions.some({
    here: 7
  });
  c.actions.some({
    here: 8
  });
  console.log(c.actions);
  const muxium = muxification('Quality Actions', {
    someConcept: c
  });
  const p = muxium.plan('outer plan', ({e__, stage, stageO}) => [
    stageO(() => e__.muxiumKick()),
    stage(({e, stagePlanner}) => {
      const log = e.muxiumLog();
      console.log('CHECK LOG', log);
      stagePlanner.conclude();
      done();
    })
  ]);

  muxium.subscribe(concepts => concepts);
  expect(f(c.actions).type).toBe('Something');
});
/*#>*/