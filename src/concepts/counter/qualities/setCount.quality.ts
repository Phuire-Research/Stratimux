/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept,
generate a quality that set the state property count to the new count provided
by the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { selectPayload } from '../../../model/selector';
import { createQualityCardWithPayload } from '../../../model/quality';

export type CounterSetCountPayload = {
  newCount: number
}
export const counterSetCount = createQualityCardWithPayload<CounterState, CounterSetCountPayload>({
  type: 'Counter set Count',
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