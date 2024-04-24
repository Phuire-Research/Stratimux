/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept, generate a quality that will decrement the state count by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { createQualitySet } from '../../../model/quality';

export const [
  counterSubtract,
  counterSubtractType,
  counterSubtractQuality
] = createQualitySet({
  type: 'Counter Subtract',
  reducer: (state: CounterState, action) => {
    return {
      ...state,
      count: state.count - 1
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/