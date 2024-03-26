/*<$
For the graph programming framework Stratimux and Counter Concept, generate a quality that will increment the state's count by one.
$>*/
/*<#*/
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { defaultMethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';

export const counterAddType: ActionType = 'Counter Add';

export const counterAdd = prepareActionCreator(counterAddType);
function counterAddReducer(state: CounterState, _: Action) {
  console.log('Counter Add', state.count, state.count + 1);
  return {
    ...state,
    count: state.count + 1
  };
}

export const counterAddQuality = createQuality(
  counterAddType,
  counterAddReducer,
  defaultMethodCreator,
  [counterSelectCount]
);
/*#>*/