/*<$
For the asynchronous graph programming framework Stratimux, generate a test that ensures that ActionStrategies
with priority are working as intended.
$>*/
/*<#*/
import { muxification  } from '../model/muxium/muxium';
import { getMuxiumState, isMuxiumOpen } from '../model/muxium/muxiumHelpers';
import { selectState } from '../model/selector/selector';
import {
  CounterState,
  createCounterConcept,
  counterName,
  CounterQualities,
  CounterDeck
} from '../concepts/counter/counter.concept';
import { generateRandomCountingStrategy } from './random/generateCountingStrategy.strategy';
import { muxiumSelectLastStrategy } from '../concepts/muxium/muxium.selector';
import { handlePriority } from '../model/priority';
import { Concept } from '../model/concept/concept.type';
import { Deck } from '../model/deck';
import { strategyBegin } from '../model/action/strategy/actionStrategyConsumers';

test('Muxium Counting Strategy Priority Test', (done) => {
  type DECK = {
    counter: Concept<CounterState, CounterQualities>;
  };
  const muxium = muxification<DECK>('muxiumStrategyTest', {counter: createCounterConcept()}, {logging: true, storeDialog: true});
  const deck = muxium.deck;

  const concluded = [false, false, false];
  deck.d;
  const [count1, strategy1] = generateRandomCountingStrategy(deck.d as Deck<CounterDeck>, 0);
  strategy1.topic += 1;
  strategy1.priority = 100;
  const [count2, strategy2] = generateRandomCountingStrategy(deck.d as Deck<CounterDeck>, 0);
  strategy1.topic += 2;
  const [count3, strategy3] = generateRandomCountingStrategy(deck.d as Deck<CounterDeck>, 0);
  strategy3.priority = 50;
  strategy1.topic += 3;
  const plan = muxium.plan<DECK>('Counting Strategy with Priority Plan',
    ({stage}) => [
      stage(({concepts, dispatch, d}) => {
        if (isMuxiumOpen(concepts)) {
          handlePriority(getMuxiumState(concepts), strategyBegin(strategy1));
          handlePriority(getMuxiumState(concepts), strategyBegin(strategy2));
          handlePriority(getMuxiumState(concepts), strategyBegin(strategy3));
          console.log('COUNT ONE STRATEGY OUTCOME: ', count1);
          console.log('COUNT TWO STRATEGY OUTCOME: ', count2);
          console.log('COUNT THREE STRATEGY OUTCOME: ', count3);
          // console.log('CHECK 1', d.muxium, 'CHECK 2', d.counter, 'CHECK 3', d);
          dispatch(d.muxium.e.muxiumKick(), {
            iterateStage: true
          });
        }
      }),
      stage(({concepts}) => {
        const muxiumState = getMuxiumState(concepts);
        const counter = selectState<CounterState>(concepts, counterName);
        // console.log('CHECK COUNT', counter, 'HEAD', muxiumState.head, 'BODY', muxiumState.body, 'TAIL', muxiumState.tail);
        if (muxiumState.lastStrategy === strategy1.topic && !concluded[0]) {
          console.log('CHECK COUNT ONE', counter?.count, count1);
          concluded[0] = true;
          expect(counter?.count).toBe(count1);
        }
        if (muxiumState.lastStrategy === strategy2.topic && !concluded[1]) {
          console.log('CHECK COUNT TWO', counter?.count, count2);
          concluded[1] = true;
          expect(counter?.count).toBe(count1 + count2 + count3);
        }
        if (muxiumState.lastStrategy === strategy3.topic && !concluded[2]) {
          console.log('CHECK COUNT THREE', counter?.count, count3);
          concluded[2] = true;
          expect(counter?.count).toBe(count1 + count3);
        }
        if (concluded[0] && concluded[1] && concluded[2]) {
          expect(counter?.count).toBe(count1 + count2 + count3);
          setTimeout(() => {done();}, 500);
          plan.conclude();
          muxium.close();
        }
      }, {selectors: [muxiumSelectLastStrategy]})
      // })
    ]);
});
/*#>*/