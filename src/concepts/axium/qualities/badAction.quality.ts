/*<$
For the graph programming framework Stratimux and Axium Concept,
generate a quality that signifies if the Axium has received a bad action that
is currently not loaded, part of the wrong generation, expired, etc... If state logging is true, the developer will be notified
of the bad action that was received.
$>*/
/*<#*/
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';
import { AxiumState } from '../axium.concept';

export type AxiumBadActionPayload = {
  badActions: Action[],
}
export const axiumBadActionType: ActionType = 'Axium received a Bad Action';
export const axiumBadAction = prepareActionWithPayloadCreator<AxiumBadActionPayload>(axiumBadActionType);

export function axiumBadActionReducer(state: AxiumState, action: Action) {
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

export const axiumBadActionQuality = createQuality(
  axiumBadActionType,
  axiumBadActionReducer
);
/*#>*/