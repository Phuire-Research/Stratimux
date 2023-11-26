/*<$
For the framework Stratimux and Axium Concept, generate a quality that will trigger the axium's closing process via
its close principle that is observing the prepareClose state property.
$>*/
/*<#*/
import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type AxiumPreClosePayload = {
  exit: boolean
};
export const axiumPreCloseType: ActionType = 'Prepare Close Axium';
export const axiumPreClose = prepareActionWithPayloadCreator<AxiumPreClosePayload>(axiumPreCloseType);

export function axiumCloseReducer(state: AxiumState, _action: Action): AxiumState {
  return {
    ...state,
    prepareClose: true,
    exit: selectPayload<AxiumPreClosePayload>(_action).exit
  };
}

export const axiumPreCloseQuality = createQuality(
  axiumPreCloseType,
  axiumCloseReducer
);
/*#>*/