/*<$
For the framework Stratimux and Counter Concept, generate a quality that will decrement the state count by one.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';

export const counterSubtractType: ActionType = 'Counter Subtract';

export const counterSubtract = prepareActionCreator(counterSubtractType);

function counterSubtractReducer(state: CounterState) {
  return {
    ...state,
    count: state.count - 1
  };
}

export const counterSubtractQuality = createQuality(
  counterSubtractType,
  counterSubtractReducer,
  defaultMethodCreator,
  [counterSelectCount]
);
/*#>*/