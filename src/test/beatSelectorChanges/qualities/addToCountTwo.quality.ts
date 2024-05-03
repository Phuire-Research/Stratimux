/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countTwo by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountTwo,
  beatSelectorChangesAddToCountTwoType,
  beatSelectorChangesAddToCountTwoQuality
] = createQualitySet({
  type: 'BeatSelectorChanges AddToCountTwo',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countTwo: state.countTwo + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/