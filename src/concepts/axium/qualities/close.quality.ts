import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type ClosePayload = {
  exit: boolean
};
export const axiumCloseType: ActionType = 'Close Axium';
export const axiumClose = prepareActionWithPayloadCreator<ClosePayload>(axiumCloseType);

export function closeReducer(state: AxiumState, _action: Action): AxiumState {
  const {exit} = selectPayload<ClosePayload>(_action);
  state.generalSubscribers.forEach(named => named.subscription.unsubscribe());
  state.methodSubscribers.forEach(named => named.subscription.unsubscribe());
  state.stagePlanners.forEach(named => named.conclude());
  state.action$.complete();
  state.concepts$.complete();
  state.subConcepts$.complete();
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

export const closeQuality = createQuality(
  axiumCloseType,
  closeReducer
);
