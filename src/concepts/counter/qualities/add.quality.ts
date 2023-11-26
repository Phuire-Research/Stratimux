import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { defaultMethodCreator, Method, MethodCreator } from '../../../model/concept';
import { CounterState } from '../counter.concept';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';

export const counterAddType: ActionType = 'Counter Add';

export const counterAdd = prepareActionCreator(counterAddType);
function counterAddReducer(state: CounterState, _: Action) {
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