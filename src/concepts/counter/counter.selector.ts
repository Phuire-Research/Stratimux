import { Counter } from './counter.concept';
import { Selector, KeyedSelector } from '../../model/selector';

export const selectCount: Selector<Counter, number> = (state: Counter) => state.count;
export const KeyedSelectCount: KeyedSelector<Counter, 'count'> = {
  key: 'count',
  selector: selectCount
};
