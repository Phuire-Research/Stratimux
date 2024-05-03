/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countThree by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountThree,
  beatSelectorChangesAddToCountThreeType,
  beatSelectorChangesAddToCountThreeQuality
] = createQualitySet({
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