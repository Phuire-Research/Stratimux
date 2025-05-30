/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept, generate a quality that will increment the state's count by one.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { createQualityCard } from '../../../model/quality';

export type CounterAdd = Quality<CounterState>;
export const counterAdd = createQualityCard<CounterState>({
  type: 'Counter Add',
  reducer: (state) => {
    return {
      count: state.count + 1
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/