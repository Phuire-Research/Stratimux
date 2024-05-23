/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will set the default mode index to what is specified by
the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumSetDefaultModeIndexPayload = {
  index: number;
};

export const [
  axiumSetDefaultModeIndex,
  axiumSetDefaultModeIndexType,
  axiumSetDefaultModeIndexQuality
] = createQualitySetWithPayload<AxiumSetDefaultModeIndexPayload>({
  type: 'set Axium\'s Default Mode Index',
  reducer: (state: AxiumState, action) => {
    const payload = selectPayload<AxiumSetDefaultModeIndexPayload>(action);
    return {
      ...state,
      defaultModeIndex: payload.index,
    } as AxiumState;
  },
  methodCreator: defaultMethodCreator
});
/*#>*/