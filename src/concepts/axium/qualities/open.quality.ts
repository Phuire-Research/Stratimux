import { Quality, Reducer, createQuality, defaultReducer } from '../../../model/concept';
import { Action, createAction } from '../../../model/action';

export const open: Action = createAction('Axium open');

export const openQuality = createQuality(
  open,
  defaultReducer
);
