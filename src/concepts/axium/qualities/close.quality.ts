import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumCloseType: ActionType = 'Close Axium';
export const axiumClose = prepareActionCreator(axiumCloseType);

export function closeReducer(state: AxiumState, _action: Action): AxiumState {
  state.generalSubscribers.forEach(named => named.subscription.unsubscribe());
  state.methodSubscribers.forEach(named => named.subscription.unsubscribe());
  state.stagePlanners.forEach(named => named.conclude());
  state.action$.complete();
  state.concepts$.complete();
  state.subConcepts$.complete();
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
