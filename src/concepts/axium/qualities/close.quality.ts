import { Quality, Reducer, createQuality } from '../../../model/concept';
import { Action, createAction } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const close: Action = createAction('Axium Close');

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
  close,
  closeReducer
);