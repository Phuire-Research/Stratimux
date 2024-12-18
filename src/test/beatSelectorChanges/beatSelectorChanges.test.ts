/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that changes are properly deferred
utilizing the provided BeatSelectorChanges concept
$>*/
/*<#*/
import { muxification } from '../../model/muxium/muxium';
import { getMuxiumState, isMuxiumOpen } from '../../model/muxium/muxiumHelpers';
import { generateRandomCountingStrategy } from './strategies/generateCountingStrategy.strategy';
import { BeatSelectorChangesDeck, createBeatSelectorChangesConcept } from './beatSelectorChanges.concept';
import {
  beatSelectorChangesSelectCountFive,
  beatSelectorChangesSelectCountFour,
  beatSelectorChangesSelectCountOne,
  beatSelectorChangesSelectCountSeven,
  beatSelectorChangesSelectCountSix,
  beatSelectorChangesSelectCountThree,
  beatSelectorChangesSelectCountTwo
} from './beatSelectorChanges.selector';
import { selectSlice } from '../../model/selector/selector';
import { Deck } from '../../model/deck';
import { MuxiumDeck } from '../../concepts/muxium/muxium.concept';
import { strategyBegin } from '../../model/action/strategy/actionStrategyConsumers';
jest.setTimeout(30000);
test('Deferred Beat Selector Changes Test', (done) => {
  const beat = 7000;
  const muxium = muxification('Beat Selector Changes properly defers accumulated changes', {
    beatSelectors: createBeatSelectorChangesConcept()
  });
  const [tally, strategy, topic] = generateRandomCountingStrategy(muxium.deck.d as Deck<MuxiumDeck & BeatSelectorChangesDeck>);
  const plan = muxium.plan('Prolonged Counting Strategy', ({stage}) => [
    stage(({concepts, dispatch}) => {
      if (isMuxiumOpen(concepts)) {
        dispatch(strategyBegin(strategy), {
          iterateStage: true
        });
      }
    }),
    stage(({concepts, changes}) => {
      if (getMuxiumState(concepts).lastStrategy === topic) {
        expect(selectSlice(concepts, beatSelectorChangesSelectCountOne)).toBe(tally[0]);
        expect(selectSlice(concepts, beatSelectorChangesSelectCountTwo)).toBe(tally[1]);
        expect(selectSlice(concepts, beatSelectorChangesSelectCountThree)).toBe(tally[2]);
        expect(selectSlice(concepts, beatSelectorChangesSelectCountFour)).toBe(tally[3]);
        expect(selectSlice(concepts, beatSelectorChangesSelectCountFive)).toBe(tally[4]);
        expect(selectSlice(concepts, beatSelectorChangesSelectCountSix)).toBe(tally[5]);
        expect(selectSlice(concepts, beatSelectorChangesSelectCountSeven)).toBe(tally[6]);
        expect(changes?.length).toBe(tally.length);
        setTimeout(() => {
          plan.conclude();
          muxium.close();
          done();
        }, 500);
      }
    }, {
      beat,
      selectors: [
        beatSelectorChangesSelectCountOne,
        beatSelectorChangesSelectCountTwo,
        beatSelectorChangesSelectCountThree,
        beatSelectorChangesSelectCountFour,
        beatSelectorChangesSelectCountFive,
        beatSelectorChangesSelectCountSix,
        beatSelectorChangesSelectCountSeven,
      ]
    })
  ]);
});
/*#>*/