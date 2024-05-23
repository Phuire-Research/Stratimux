/*<$
For the asynchronous graph programming framework Stratimux and BeatSelectorChanges Concept,
generate a quality that will increment the state's countSeven by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { BeatSelectorChangesState } from '../beatSelectorChanges.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  beatSelectorChangesAddToCountSeven,
  beatSelectorChangesAddToCountSevenType,
  beatSelectorChangesAddToCountSevenQuality
] = createQualitySet({
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