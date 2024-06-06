/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept, generate a quality that will decrement the state count by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { createQualityCard } from '../../../model/quality';

export const counterSubtract = createQualityCard<CounterState>({
  type: 'Counter Subtract',
  reducer: (state) => {
    return {
      ...state,
      count: state.count - 1
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/