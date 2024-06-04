/*<$
For the asynchronous graph programming framework Stratimux generate an Experiment Concept that will be used to test deferred changes
accumulated for stage that has a beat and selectors
$>*/
/*<#*/
import { beatSelectorChangesAddToCountOneQuality } from './qualities/addToCountOne.quality';
import { createConcept } from '../../model/concept';
import { beatSelectorChangesAddToCountTwoQuality } from './qualities/addToCountTwo.quality';
import { beatSelectorChangesAddToCountThreeQuality } from './qualities/addToCountThree.quality';
import { beatSelectorChangesAddToCountFourQuality } from './qualities/addToCountFour.quality';
import { beatSelectorChangesAddToCountFiveQuality } from './qualities/addToCountFive.quality';
import { beatSelectorChangesAddToCountSixQuality } from './qualities/addToCountSix.quality';
import { beatSelectorChangesAddToCountSevenQuality } from './qualities/addToCountSeven.quality';

export type BeatSelectorChangesState = {
    countOne: number
    countTwo: number
    countThree: number
    countFour: number
    countFive: number
    countSix: number
    countSeven: number
}

export const beatSelectorChangesName = 'beatSelectorChanges';

const initialBeatSelectorChangesState: BeatSelectorChangesState = {
  countOne: 0,
  countTwo: 0,
  countThree: 0,
  countFour: 0,
  countFive: 0,
  countSix: 0,
  countSeven: 0,
};

const beatSelectorChangesQualities = {
  beatSelectorChangesAddToCountOneQuality,
  beatSelectorChangesAddToCountTwoQuality,
  beatSelectorChangesAddToCountThreeQuality,
  beatSelectorChangesAddToCountFourQuality,
  beatSelectorChangesAddToCountFiveQuality,
  beatSelectorChangesAddToCountSixQuality,
  beatSelectorChangesAddToCountSevenQuality,
};

export type BeatSelectorChangesQualities = typeof beatSelectorChangesQualities;

export const createBeatSelectorChangesConcept = () => {
  return createConcept<BeatSelectorChangesState, BeatSelectorChangesQualities>(
    beatSelectorChangesName,
    initialBeatSelectorChangesState,
    beatSelectorChangesQualities
  );
};
/*#>*/