/*<$
For the framework Stratimux and Axium Concept, generate a quality that will close the axium, if exit is set to true.
This will also exit the current process.
$>*/
/*<#*/
import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

/**
 * @parm exit - If set to true, will exit the current process.
 */
export type AxiumClosePayload = {
  exit: boolean
};
export const axiumCloseType: ActionType = 'Close Axium';
export const axiumClose = prepareActionWithPayloadCreator<AxiumClosePayload>(axiumCloseType);

export function axiumCloseReducer(state: AxiumState, _action: Action): AxiumState {
  const {exit} = selectPayload<AxiumClosePayload>(_action);
  state.generalSubscribers.forEach(named => named.subscription.unsubscribe());
  state.methodSubscribers.forEach(named => named.subscription.unsubscribe());
  state.stagePlanners.forEach(named => named.conclude());
  state.action$.complete();
  state.concepts$.complete();
  state.innerConcepts$.complete();
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

export const axiumCloseQuality = createQuality(
  axiumCloseType,
  axiumCloseReducer
);
/*#>*/