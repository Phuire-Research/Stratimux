/*<$
For the asynchronous graph programming framework Stratimux generate an Experiment Concept that will be used to test deferred changes
accumulated for stage that has a beat and selectors
$>*/
/*<#*/
import { beatSelectorChangesAddToCountOne} from './qualities/addToCountOne.quality';
import { Concept, createConcept } from '../../model/concept';
import { beatSelectorChangesAddToCountTwo} from './qualities/addToCountTwo.quality';
import { beatSelectorChangesAddToCountThree} from './qualities/addToCountThree.quality';
import { beatSelectorChangesAddToCountFour} from './qualities/addToCountFour.quality';
import { beatSelectorChangesAddToCountFive} from './qualities/addToCountFive.quality';
import { beatSelectorChangesAddToCountSix} from './qualities/addToCountSix.quality';
import { beatSelectorChangesAddToCountSeven } from './qualities/addToCountSeven.quality';

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

export type BeatSelectorChangesQualities = typeof beatSelectorChangesQualities;

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