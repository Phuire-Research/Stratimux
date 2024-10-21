/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will close the muxium, if exit is set to true.
This will also exit the current process.
$>*/
/*<#*/
import { MuxiumState } from '../muxium.concept';
import { selectPayload } from '../../../model/selectors/selector';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumClosePayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept';

export const muxiumClose = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumClosePayload>({
  type: 'Close Muxium',
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