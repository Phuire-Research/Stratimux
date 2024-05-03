/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a KeyedSelector for the BeatSelectorChanges's count variants state properties.
$>*/
/*<#*/
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { BeatSelectorChangesState } from './beatSelectorChanges.concept';

export const beatSelectorChangesSelectCountOne: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countOne');
export const beatSelectorChangesSelectCountTwo: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countTwo');
export const beatSelectorChangesSelectCountThree: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countThree');
export const beatSelectorChangesSelectCountFour: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countFour');
export const beatSelectorChangesSelectCountFive: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countFive');
export const beatSelectorChangesSelectCountSix: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countSix');
export const beatSelectorChangesSelectCountSeven: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('beatSelectorChanges', 'countSeven');
/*#>*/