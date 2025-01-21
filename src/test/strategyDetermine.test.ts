/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that the strategyDetermine helper function is
dispatching a single action ActionStrategy, and is also able to accept any possible Action.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { CounterState, createCounterConcept, countingStrategy, counterName, CounterQualities } from '../concepts/counter/counter.concept';
import { Concept } from '../model/concept/concept.type';
import { strategyDetermine } from '../model/action/strategy/actionStrategyConsumersAdvanced';

test('Muxium Strategy Determine', (done) => {
  const cpts = {counter: createCounterConcept()};
  const muxium = muxification('muxiumStrategyTest', cpts, {logging: true, storeDialog: true});
  const FINAL_COUNT = 7;

  type DECK = {
    counter: Concept<CounterState, CounterQualities>;
  };
  const plan = muxium.plan<DECK>('Counting Strategy Plan',
    ({stage}) => [
      stage(({dispatch, d, e}) => {
        // Ensure that the entry is assigned to the Muxium for the sake of testing.
        e.muxiumKick();
        // Specified test starts here.
        dispatch(strategyDetermine(d.counter.e.counterAdd()), {
          iterateStage: true
        });
      }),
      stage(({dispatch, d}) => {
        expect(d.counter.k.count.select()).toBe(1);
        dispatch(strategyDetermine(d.counter.e.counterSetCount({
          newCount: FINAL_COUNT
        })), {
          iterateStage: true
        });
      }),
      stage(({d}) => {
        expect(d.counter.k.count.select()).toBe(FINAL_COUNT);
        setTimeout(() => {done();}, 500);
        plan.conclude();
        muxium.close();
      })
    ]);
});
/*#>*/