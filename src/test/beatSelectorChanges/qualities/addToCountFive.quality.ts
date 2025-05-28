/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countFive by one.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export type BeatSelectorChangesAddToCountFive = Quality<BeatSelectorChangesState>;
export const beatSelectorChangesAddToCountFive = createQualityCard({
  type: 'BeatSelectorChanges AddToCountFive',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      countFive: state.countFive + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/