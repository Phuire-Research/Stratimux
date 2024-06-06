/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countTwo by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountTwo,
  beatSelectorChangesAddToCountTwoType,
  beatSelectorChangesAddToCountTwoQuality
] = createQualityCard({
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