/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept, generate a quality that will multiply another by an incoming payload
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { createQualitySetWithPayload } from '../../../model/quality';
import { selectPayload } from '../../../model/selector';

type CounterMultiplyPayload = {
  by: number;
};

export const [
  counterMultiply,
  counterMultiplyType,
  counterMultiplyQuality
] = createQualitySetWithPayload<CounterMultiplyPayload>({
  type: 'Counter Multiply',
  reducer: (state: CounterState, action) => {
    const {by} = selectPayload<CounterMultiplyPayload>(action);
    return {
      ...state,
      count: state.count * by
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/