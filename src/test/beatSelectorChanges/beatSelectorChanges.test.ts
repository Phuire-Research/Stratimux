/*<$
For the asynchronous graph programming framework Stratimux generate a test that ensures that changes are properly deferred
utilizing the provided BeatSelectorChanges concept
$>*/
/*<#*/
import { createAxium, getAxiumState, isAxiumOpen } from '../../model/axium';
import { createStage } from '../../model/stagePlanner';
import { generateRandomCountingStrategy } from './strategies/generateCountingStrategy.strategy';
import { beatSelectorChangesName, createBeatSelectorChangesConcept } from './beatSelectorChanges.concept';
import { initializeTopic } from '../../concepts/axium/strategies/initialization.strategy';
import { strategyBegin } from '../../model/actionStrategy';
import {
  beatSelectorChangesSelectCountFive,
  beatSelectorChangesSelectCountFour,
  beatSelectorChangesSelectCountOne,
  beatSelectorChangesSelectCountSeven,
  beatSelectorChangesSelectCountSix,
  beatSelectorChangesSelectCountThree,
  beatSelectorChangesSelectCountTwo
} from './beatSelectorChanges.selector';
import { selectSlice, selectState } from '../../model/selector';
jest.setTimeout(30000);
test('Deferred Beat Selector Changes Test', (done) => {
  const beat = 7000;
  const [tally, strategy, topic] = generateRandomCountingStrategy();
  const axium = createAxium('Beat Selector Changes properly defers accumulated changes', {
    beatSelectors: createBeatSelectorChangesConcept()
  });
  const plan = axium.plan('Prolonged Counting Strategy', () => [
    createStage(({concepts, dispatch}) => {
      if (isAxiumOpen(concepts)) {
        dispatch(strategyBegin(strategy), {
          iterateStage: true
        });
      }
    }),
    createStage(({concepts, changes}) => {
      if (getAxiumState(concepts).lastStrategy === topic) {
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
          axium.close();
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