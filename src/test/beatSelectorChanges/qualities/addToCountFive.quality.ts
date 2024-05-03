/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countFive by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountFive,
  beatSelectorChangesAddToCountFiveType,
  beatSelectorChangesAddToCountFiveQuality
] = createQualitySet({
  type: 'BeatSelectorChanges AddToCountFive',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countFive: state.countFive + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/