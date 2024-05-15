/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies are working as intended.
In addition utilize the onChange detection feature for the UnifiedSubject is working as intended.
$>*/
/*<#*/
import { createAxium } from '../model/axium';
import { strategyBegin } from '../model/actionStrategy';
import { selectSlice, selectState } from '../model/selector';
import { CounterState, createCounterConcept, countingStrategy, counterName } from '../concepts/counter/counter.concept';
import { AxiumState } from '../concepts/axium/axium.concept';
import { countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { createStage } from '../model/stagePlanner';
import { counterSelectCount } from '../concepts/counter/counter.selector';
import { axiumSelectLastStrategy } from '../concepts/axium/axium.selector';
import { axiumKick } from '../concepts/axium/qualities/kick.quality';
import { initializeTopic } from '../concepts/axium/strategies/initialization.strategy';
import { Concepts } from '../model/concept';

test('Axium onChange Test', (done) => {
  const selectorRouter = {
    [axiumSelectLastStrategy.keys]: (concepts: Concepts) =>
      console.log('CHECK: ', selectSlice(concepts, axiumSelectLastStrategy))
  };
  const axium = createAxium('axiumStrategyTest', [createCounterConcept()], {logging: true, storeDialog: true});
  const plan = axium.plan('Counting Strategy Plan with selectors',
    [
      createStage((concepts, dispatch) => {
        console.log('WHAT IS THIS', selectSlice(concepts, axiumSelectLastStrategy));
        if (selectSlice(concepts, axiumSelectLastStrategy) === initializeTopic) {
          dispatch(strategyBegin(countingStrategy()), {
            iterateStage: true
          });
        }
      }, {selectors: [axiumSelectLastStrategy]}),
      createStage((concepts, dispatch, changes) => {
        console.log('Check Changes: ',  changes);
        changes?.forEach(keyed => {
          selectorRouter[keyed.keys] ? selectorRouter[keyed.keys](concepts) : null;
        });
        const axiumState = concepts[0].state as AxiumState;
        const counter = selectState<CounterState>(concepts, counterName);
        if (axiumState.lastStrategy === countingTopic) {
          expect(counter?.count).toBe(1);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          axium.close();
        } else {
          dispatch(axiumKick(), {
            newSelectors: [counterSelectCount, axiumSelectLastStrategy],
            throttle: 0
          });
        }
      }, {
        selectors: [counterSelectCount]
      })
    ]);
});
/*#>*/