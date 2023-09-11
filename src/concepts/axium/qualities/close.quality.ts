import { Quality, Reducer, createQuality } from '../../../model/concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumCloseType: ActionType = 'Axium Close';

export function closeReducer(state: AxiumState, _action: Action) {
  state.generalSubscribers.forEach(keyed => keyed.subscriber.unsubscribe());
  state.methodSubscribers.forEach(keyed => keyed.subscriber.unsubscribe());
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