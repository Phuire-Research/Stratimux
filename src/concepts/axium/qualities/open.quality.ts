import { Quality, Reducer, createQuality, defaultReducer } from '../../../model/concept';
import { Action, createAction } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const open: Action = createAction('Axium open');

export function openReducer(state: AxiumState, action: Action) {
  return {
    ...state,
    open: true
  };
}
export const openQuality = createQuality(
  open,
  openReducer
);
