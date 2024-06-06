/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countFour by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountFour,
  beatSelectorChangesAddToCountFourType,
  beatSelectorChangesAddToCountFourQuality
] = createQualityCard({
  type: 'BeatSelectorChanges AddToCountFour',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countFour: state.countFour + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/