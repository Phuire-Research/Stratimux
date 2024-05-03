/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a KeyedSelector for the BeatSelectorChanges's count variants state properties.
$>*/
/*<#*/
import { KeyedSelector, createConceptKeyedSelector } from '../../model/selector';
import { BeatSelectorChangesState } from './beatSelectorChanges.concept';

export const beatSelectorChangesSelectCountOne: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countOne');
export const beatSelectorChangesSelectCountTwo: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countTwo');
export const beatSelectorChangesSelectCountThree: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countThree');
export const beatSelectorChangesSelectCountFour: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countFour');
export const beatSelectorChangesSelectCountFive: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countFive');
export const beatSelectorChangesSelectCountSix: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countSix');
export const beatSelectorChangesSelectCountSeven: KeyedSelector =
  createConceptKeyedSelector<BeatSelectorChangesState>('BeatSelectorChanges', 'countSeven');
/*#>*/