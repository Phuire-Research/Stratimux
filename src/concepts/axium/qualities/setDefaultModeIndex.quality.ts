/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will set the default mode index to what is specified by
the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumSetDefaultModeIndexPayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const axiumSetDefaultModeIndex = createQualityCardWithPayload<AxiumState<unknown, LoadConcepts>, AxiumSetDefaultModeIndexPayload>({
  type: 'set Axium\'s Default Mode Index',
  reducer: (_, action) => {
    const payload = action.payload;
    return {
      defaultModeIndex: payload.index,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/