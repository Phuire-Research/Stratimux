/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countSeven by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export const beatSelectorChangesAddToCountSeven = createQualityCard({
  type: 'BeatSelectorChanges AddToCountSeven',
  reducer: (state: BeatSelectorChangesState) => {
    return {
      ...state,
      countSeven: state.countSeven + 1
    };
  },
  methodCreator: defaultMethodCreator,
});
/*#>*/