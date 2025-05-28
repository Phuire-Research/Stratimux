/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countSeven by one.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export type BeatSelectorChangesAddToCountSeven = Quality<BeatSelectorChangesState>;
export const beatSelectorChangesAddToCountSeven = createQualityCard({
  type: 'BeatSelectorChanges AddToCountSeven',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      countSeven: state.countSeven + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/