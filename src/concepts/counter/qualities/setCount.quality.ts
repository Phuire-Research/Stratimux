/*<$
For the framework Stratimux and Counter Concept, generate a quality that set the state property count to the new count provided
by the action's payload.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { counterSelectCount } from '../counter.selector';
import { selectPayload } from '../../../model/selector';

export const counterSetCountType = 'Counter set Count';

export type CounterSetCountPayload = {
  newCount: number
}
export const counterSetCount = prepareActionWithPayloadCreator<CounterSetCountPayload>(counterSetCountType);

function counterSetCountReducer(state: CounterState, action: Action) {
  const payload = selectPayload<CounterSetCountPayload>(action);
  return {
    ...state,
    count: payload.newCount
  };
}

export const counterSetCountQuality = createQuality(
  counterSetCountType,
  counterSetCountReducer,
  defaultMethodCreator,
  [counterSelectCount]
);
/*#>*/