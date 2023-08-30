import { Quality, Reducer, defaultReducer } from '../../../model/concept';
import { Action, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const chainCount: Action = createAction('Counter Chain Count');

export const chainCountQuality = createQuality(
  chainCount,
  defaultReducer
);
