/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countThree by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountThree,
  beatSelectorChangesAddToCountThreeType,
  beatSelectorChangesAddToCountThreeQuality
] = createQualityCard({
  type: 'BeatSelectorChanges AddToCountThree',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countThree: state.countThree + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/