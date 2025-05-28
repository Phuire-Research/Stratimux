/*<$
For the asynchronous graph programming framework Stratimux generate an Experiment Concept that will be used to test deferred changes
accumulated for stage that has a beat and selectors
$>*/
/*<#*/
import { BeatSelectorChangesAddToCountOne, beatSelectorChangesAddToCountOne} from './qualities/addToCountOne.quality';
import { Concept } from '../../model/concept/concept.type';
import { createConcept } from '../../model/concept/concept';
import { BeatSelectorChangesAddToCountTwo, beatSelectorChangesAddToCountTwo} from './qualities/addToCountTwo.quality';
import { BeatSelectorChangesAddToCountThree, beatSelectorChangesAddToCountThree} from './qualities/addToCountThree.quality';
import { BeatSelectorChangesAddToCountFour, beatSelectorChangesAddToCountFour} from './qualities/addToCountFour.quality';
import { BeatSelectorChangesAddToCountFive, beatSelectorChangesAddToCountFive} from './qualities/addToCountFive.quality';
import { BeatSelectorChangesAddToCountSix, beatSelectorChangesAddToCountSix} from './qualities/addToCountSix.quality';
import { BeatSelectorChangesAddToCountSeven, beatSelectorChangesAddToCountSeven } from './qualities/addToCountSeven.quality';

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
  beatSelectorChangesAddToCountOne,
  beatSelectorChangesAddToCountTwo,
  beatSelectorChangesAddToCountThree,
  beatSelectorChangesAddToCountFour,
  beatSelectorChangesAddToCountFive,
  beatSelectorChangesAddToCountSix,
  beatSelectorChangesAddToCountSeven,
};

export type BeatSelectorChangesQualities = {
  beatSelectorChangesAddToCountOne: BeatSelectorChangesAddToCountOne,
  beatSelectorChangesAddToCountTwo: BeatSelectorChangesAddToCountTwo,
  beatSelectorChangesAddToCountThree: BeatSelectorChangesAddToCountThree,
  beatSelectorChangesAddToCountFour: BeatSelectorChangesAddToCountFour,
  beatSelectorChangesAddToCountFive: BeatSelectorChangesAddToCountFive,
  beatSelectorChangesAddToCountSix: BeatSelectorChangesAddToCountSix,
  beatSelectorChangesAddToCountSeven: BeatSelectorChangesAddToCountSeven,
};

export type BeatSelectorChangesDeck = {
  beatSelectors: Concept<BeatSelectorChangesState, BeatSelectorChangesQualities>;
}

export const createBeatSelectorChangesConcept = () => {
  return createConcept<BeatSelectorChangesState, BeatSelectorChangesQualities>(
    beatSelectorChangesName,
    initialBeatSelectorChangesState,
    beatSelectorChangesQualities
  );
};
/*#>*/