/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will close the axium, if exit is set to true.
This will also exit the current process.
$>*/
/*<#*/
import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySet, createQualitySetWithPayload } from '../../../model/quality';

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type AxiumClosePayload = {
  exit: boolean
};
export const [
  axiumClose,
  axiumCloseType,
  axiumCloseQuality
] = createQualitySetWithPayload<AxiumClosePayload>({
  type: 'Close Axium',
  reducer: (state: AxiumState, action) => {
    const {exit} = selectPayload<AxiumClosePayload>(action);
    state.generalSubscribers.forEach(named => named.subscription.unsubscribe());
    state.methodSubscribers.forEach(named => named.subscription.unsubscribe());
    state.stagePlanners.forEach(named => named.conclude());
    state.action$.complete();
    state.concepts$.complete();
    state.actionConcepts$.complete();
    if (exit) {
      process.exit();
    }
    return {
      ...state,
      methodSubscribers: [],
      generalSubscribers: [],
      stagePlanners: [],
    };
  }
});
/*#>*/