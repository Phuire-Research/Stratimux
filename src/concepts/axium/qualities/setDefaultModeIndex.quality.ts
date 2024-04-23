/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will set the default mode index to what is specified by
the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type AxiumSetDefaultModeIndexPayload = {
  index: number;
};
export const axiumSetDefaultModeIndexType: ActionType = 'set Axium\'s Default Mode Index';
export const axiumSetDefaultModeIndex = prepareActionWithPayloadCreator<AxiumSetDefaultModeIndexPayload>(axiumSetDefaultModeIndexType);

export function axiumSetDefaultModeIndexReducer(state: AxiumState, action: Action) {
  const payload = selectPayload<AxiumSetDefaultModeIndexPayload>(action);
  return {
    ...state,
    defaultModeIndex: payload.index,
  } as AxiumState;
}
export const axiumSetDefaultModeIndexQuality = createQuality(
  axiumSetDefaultModeIndexType,
  axiumSetDefaultModeIndexReducer,
  defaultMethodCreator
);
/*#>*/