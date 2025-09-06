/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures LocalPrinciple
provides access to the plan function from within a local context, enabling components to create
their own stage planners while maintaining bidirectional separation of concerns.
$>*/
/*<#*/
import { muxification } from '../model/muxium/muxium';
import { createLocalPrinciple } from '../model/localPrinciple';
import { CounterState, createCounterConcept, counterName, CounterQualities  } from '../concepts/counter/counter.concept';
import { Concept } from '../model/concept/concept.type';
import { selectState } from '../model/selector/selector';
import { getMuxiumState } from '../model/muxium/muxiumHelpers';
import { countingStrategy, countingTopic } from '../concepts/counter/strategies/counting.strategy';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

test('Local Principle Creation Test', (done) => {
  const cpts = { counter: createCounterConcept() };
  const muxium = muxification('localPrincipleTest', cpts, { logging: true });

  type DECK = {
    counter: Concept<CounterState, CounterQualities>;
  };

  createLocalPrinciple('Test Local Counter Principle', muxium, ({plan}) => {
    plan<DECK>('Counting Strategy Plan',
      ({stage}) => [
        stage(({stagePlanner, dispatch, d, e}) => {
          const str = countingStrategy(d);
          if (str) {
            dispatch(strategyBegin(str), {
              iterateStage: true
            });
          } else {
            stagePlanner.conclude();
            expect(false).toBe(true);
            setTimeout(() => {done();}, 500);
          }
        }),
        stage(({concepts, d, stagePlanner}) => {
          const muxiumState = getMuxiumState(concepts);
          if (muxiumState.lastStrategy === countingTopic) {
            const counter = selectState<CounterState>(concepts, counterName);
            expect(counter?.count).toBe(1);
            expect(d.counter.k.count.select()).toBe(1);
            console.log('CHECK FINAL COUNT: ', d.counter.k.count.select());
            setTimeout(() => {done();}, 500);
            stagePlanner.conclude();
            muxium.close();
          }
        })
      ]);
  });
});

/*#>*/
