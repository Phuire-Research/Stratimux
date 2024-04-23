/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that signifies if the Axium has received a bad action that
is currently not loaded, part of the wrong generation, expired, etc... If state logging is true, the developer will be notified
of the bad action that was received.
$>*/
/*<#*/
import { Action } from '../../../model/action';
import { createQualitySetWithPayload } from '../../../model/quality';
import { selectPayload } from '../../../model/selector';
import { AxiumState } from '../axium.concept';

export type AxiumBadActionPayload = {
  badActions: Action[],
}
export const [
  axiumBadAction,
  axiumBadActionType,
  axiumBadActionQuality
] = createQualitySetWithPayload<AxiumBadActionPayload>({
  type: 'Axium received a Bad Action',
  reducer: (state: AxiumState, action) => {
    const payload = selectPayload<AxiumBadActionPayload>(action).badActions;
    if (state.logging) {
      console.log('Axium Received a Bad Action: ', action);
    }
    return {
      ...state,
      badActions: [
        ...state.badActions, ...payload
      ]
    };
  }
});
/*#>*/