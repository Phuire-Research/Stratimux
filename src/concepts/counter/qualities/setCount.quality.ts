/*<$
For the asynchronous graph programming framework Stratimux and Counter Concept,
generate a quality that set the state property count to the new count provided
by the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type CounterSetCountPayload = {
  newCount: number
}
export const [
  counterSetCount,
  counterSetCountType,
  counterSetCountQuality
] = createQualitySetWithPayload<CounterSetCountPayload>({
  type: 'Counter set Count',
  reducer: (state: CounterState, action) => {
    const {newCount} = selectPayload<CounterSetCountPayload>(action);
    return {
      ...state,
      count: newCount
    };
  },
  methodCreator: defaultMethodCreator,
  keyedSelectors: [counterSelectCount]
});
/*#>*/