/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept, generate a quality that will multiply another by an incoming payload
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { createQualityCardWithPayload } from '../../../model/quality';
import { selectPayload } from '../../../model/selector/selector';

type CounterMultiplyPayload = {
  by: number;
};

export type CounterMultiply = Quality<CounterState, CounterMultiplyPayload>;
export const counterMultiply = createQualityCardWithPayload<CounterState, CounterMultiplyPayload>({
  type: 'Counter Multiply',
  reducer: (state: CounterState, {payload}) => {
    const {by} = payload;
    // console.log(state.count, 'by', by);
    return {
      count: state.count * by
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/