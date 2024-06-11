/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that signifies if the Axium has received a bad action that
is currently not loaded, part of the wrong generation, expired, etc... If state logging is true, the developer will be notified
of the bad action that was received.
$>*/
/*<#*/
import { AxiumBadActionPayload } from '.';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumState } from '../axium.concept';

export const axiumBadAction = createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumBadActionPayload>({
  type: 'Axium received a Bad Action',
  reducer: (state, action) => {
    const payload = action.payload.badActions;
    if (state.logging) {
      console.log('Axium Received a Bad Action: ', action);
    }
    return {
      badActions: [
        ...state.badActions, ...payload
      ]
    };
  }
});
/*#>*/