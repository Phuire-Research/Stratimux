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
import { createQualitySet } from '../model/quality';
import { Qualities, Quality, createConcept } from '../model/concept';
import { Action, Actions } from '../model/action';
import { axiumConclude, axiumConcludeType } from '../concepts/axium/qualities/conclude.quality';

type F = <T extends object>(actions: Actions<T>) => Action;

test('Quality Actions', (done) => {
  const [one, two, something] = createQualitySet({
    type: 'Something',
    reducer: (state) => state
  });
  const qs = {
    something,
  };
  const acts = {
    something: something.actionCreator
  };
  expect(qs.something.actionType).toBe(something.actionType);

  const f = (actions: Actions<typeof acts>) => {
    return actions.something({});
  };
  const c = createConcept<typeof acts>('Some', {}, qs);
  c.actions.something;
  console.log(c.actions);
  expect(f(c.actions).type).toBe('Something');
  done();
});
/*#>*/