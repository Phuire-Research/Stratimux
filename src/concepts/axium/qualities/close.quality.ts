import { createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumCloseType: ActionType = 'Close Axium';
export const axiumClose = prepareActionCreator(axiumCloseType);

export function closeReducer(state: AxiumState, _action: Action) {
  state.generalSubscribers.forEach(named => named.subscriber.unsubscribe());
  state.methodSubscribers.forEach(named => named.subscriber.unsubscribe());
  state.action$.complete();
  state.concepts$.complete();
  state.subConcepts$.complete();
  return {
    ...state,
    methodSubscribers: [],
    generalSubscribers: []
  };
}

export const closeQuality = createQuality(
  axiumCloseType,
  closeReducer
);