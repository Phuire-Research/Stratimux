import { Counter } from './counter.concept';
import { KeyedSelector } from '../../model/selector';
import {counterKey} from './counter.concept';

export const counterSelectCount: KeyedSelector = {
  conceptKey: counterKey,
  stateKeys: 'count',
};
