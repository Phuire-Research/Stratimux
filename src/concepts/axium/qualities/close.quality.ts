/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will close the axium, if exit is set to true.
This will also exit the current process.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumClosePayload } from '.';

export const axiumClose = createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumClosePayload>({
  type: 'Close Axium',
  reducer: (state, action) => {
    const {exit} = action.payload;
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
      methodSubscribers: [],
      generalSubscribers: [],
      stagePlanners: [],
    };
  }
});
/*#>*/