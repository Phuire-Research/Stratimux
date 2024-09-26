/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that signifies if the Muxium has received a bad action that
is currently not loaded, part of the wrong generation, expired, etc... If state logging is true, the developer will be notified
of the bad action that was received.
$>*/
/*<#*/
import { MuxiumBadActionPayload } from '.';
import { LoadConcepts } from '../../../model/concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';

export const muxiumBadAction = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumBadActionPayload>({
  type: 'Muxium received a Bad Action',
  reducer: (state, action) => {
    const payload = action.payload.badActions;
    if (state.logging) {
      console.log('Muxium Received a Bad Action: ', action);
    }
    return {
      badActions: [
        ...state.badActions, ...payload
      ]
    };
  }
});
/*#>*/