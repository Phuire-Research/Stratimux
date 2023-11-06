import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type PreClosePayload = {
  exit: boolean
};
export const axiumPreCloseType: ActionType = 'Prepare Close Axium';
export const axiumPreClose = prepareActionWithPayloadCreator<PreClosePayload>(axiumPreCloseType);

export function closeReducer(state: AxiumState, _action: Action): AxiumState {
  return {
    ...state,
    prepareClose: true,
    exit: selectPayload<PreClosePayload>(_action).exit
  };
}

export const axiumPreCloseQuality = createQuality(
  axiumPreCloseType,
  closeReducer
);
