/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will clear the state's dialog.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCard } from '../../../model/quality';
import { LoadConcepts } from '../../../model/concept/concept';

export const muxiumClearDialog = createQualityCard<MuxiumState<unknown, LoadConcepts>>({
  type: 'clear Muxium Dialog',
  reducer: () => {
    return {
      dialog: '',
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/