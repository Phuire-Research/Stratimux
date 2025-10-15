/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept,
generate a quality that set the state property count to the new count provided
by the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { selectPayload } from '../../../model/selector/selector';
import { createQualityCardWithPayload } from '../../../model/quality';

export type CounterSetCountPayload = {
  newCount: number
}

export type CounterSetCount = Quality<CounterState, CounterSetCountPayload>;
export const counterSetCount = createQualityCardWithPayload<CounterState, CounterSetCountPayload>({
  type: 'Counter Set Count',
  reducer: (state, {payload}) => {
    const {newCount} = payload;
    return {
      count: newCount
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/