/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countSix by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualityCard } from '../../../model/quality';

export const beatSelectorChangesAddToCountSix = createQualityCard({
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