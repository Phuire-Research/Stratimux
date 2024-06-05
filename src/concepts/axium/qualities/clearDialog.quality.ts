/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will clear the state's dialog.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  axiumClearDialog,
  axiumClearDialogType,
  axiumClearDialogQuality
] = createQualitySet<AxiumState>({
  type: 'clear Axium Dialog',
  reducer: (state) => {
    return {
      ...state,
      dialog: '',
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/