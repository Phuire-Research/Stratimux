/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countSix by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountSix,
  beatSelectorChangesAddToCountSixType,
  beatSelectorChangesAddToCountSixQuality
] = createQualitySet({
  type: 'BeatSelectorChanges AddToCountSix',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countSix: state.countSix + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/