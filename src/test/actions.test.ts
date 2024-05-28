/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures qualities are being created with actions.
And ensure that the semaphore is being set via the Axium for the actions created using said qualities.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { createStage } from '../model/stagePlanner';
import { createQualitySet, createQualitySetWithPayload } from '../model/quality';
import { Qualities, Quality, createConcept } from '../model/concept';
import { Action, Actions } from '../model/action';
import { axiumConclude, axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';

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
  const c = createConcept<typeof qs>('Some', {}, qs);
  c.actions.something;
  c.actions.some({
    here: 7
  });
  c.actions.some({
    here: 8
  });
  console.log(c.actions);
  expect(f(c.actions).type).toBe('Something');
  done();
});
/*#>*/