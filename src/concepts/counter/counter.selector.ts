import { Counter } from './counter.concept';
import { KeyedSelector } from '../../model/selector';
import {counterKey} from './counter.concept';

export const keyedSelectCount: KeyedSelector = {
  conceptKey: counterKey,
  stateKeys: 'count',
};
