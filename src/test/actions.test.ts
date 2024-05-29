/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures qualities are being created with actions.
And ensure that the semaphore is being set via the Axium for the actions created using said qualities.
$>*/
/*<#*/
import { Axium, createAxium } from '../model/axium';
import { createQualitySet, createQualitySetWithPayload } from '../model/quality';
import { createConcept } from '../model/concept';
import { Actions } from '../model/action';
import { createStage, stageWaitForOpenThenIterate } from '../model/stagePlanner';
import { AxiumQualities } from '../concepts/axium/axium.concept';

test('Quality Actions', (done) => {
  const [one, two, something] = createQualitySet({
    type: 'Something',
    reducer: (state) => state
  });
  type payload = {
    here: number;
  };

  const [_, __, some] = createQualitySetWithPayload<payload>({
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
  const c = createConcept<typeof qs>('Some', {}, qs, [
    ({a_}) => {
      console.log('HIT PRINCIPLE', a_.some({
        here: 2
      }));
      expect(a_.something().type).toBe('Something');
    }
  ]);
  c.actions.something;
  c.actions.some({
    here: 7
  });
  c.actions.some({
    here: 8
  });
  console.log(c.actions);
  const axium = createAxium('Quality Actions', [
    c
  ]);
  const p = axium.plan<AxiumQualities>('outer plan', ({a__}) => [
    stageWaitForOpenThenIterate(() => a__.axiumKickQuality()),
    createStage<AxiumQualities>(({a, stagePlanner}) => {
      const log = a.axiumLogQuality();
      console.log('CHECK LOG', log);
      stagePlanner.conclude();
      done();
    })
  ]);

  axium.subscribe(concepts => concepts);
  expect(f(c.actions).type).toBe('Something');
});
/*#>*/