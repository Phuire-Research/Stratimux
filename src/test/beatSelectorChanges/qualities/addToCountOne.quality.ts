/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countOne by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountOne,
  beatSelectorChangesAddToCountOneType,
  beatSelectorChangesAddToCountOneQuality
] = createQualitySet({
  type: 'BeatSelectorChanges AddToCountOne',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countOne: state.countOne + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/