/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countThree by one.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export type BeatSelectorChangesAddToCountThree = Quality<BeatSelectorChangesState>;
export const beatSelectorChangesAddToCountThree = createQualityCard({
  type: 'BeatSelectorChanges AddToCountThree',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      countThree: state.countThree + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/