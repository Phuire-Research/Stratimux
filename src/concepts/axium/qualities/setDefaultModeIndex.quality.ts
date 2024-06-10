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

export const axiumSetDefaultModeIndex = createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumSetDefaultModeIndexPayload>({
  type: 'set Axium\'s Default Mode Index',
  reducer: (state, action) => {
    const payload = action.payload;
    return {
      ...state,
      defaultModeIndex: payload.index,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/