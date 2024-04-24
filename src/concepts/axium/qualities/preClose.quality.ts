/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality that will trigger the axium's closing process via
its close principle that is observing the prepareClose state property.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type AxiumPreClosePayload = {
  exit: boolean
};
export const [
  axiumPreClose,
  axiumPreCloseType,
  axiumPreCloseQuality
] = createQualitySetWithPayload<AxiumPreClosePayload>({
  type: 'Prepare Close Axium',
  reducer: (state: AxiumState, action) => {
    return {
      ...state,
      prepareClose: true,
      exit: selectPayload<AxiumPreClosePayload>(action).exit
    };
  }
});
/*#>*/