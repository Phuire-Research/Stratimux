import { Counter } from './counter.concept';
import { Selector, KeyedSelector } from '../../model/selector';
import {counterConcept} from './counter.concept';

export const selectCount: Selector<Counter, number> = (state: Counter) => state.count;
export const keyedSelectCount: KeyedSelector<Counter, 'count'> = {
  conceptKey: counterConcept.key,
  key: 'count',
  selector: selectCount
};
