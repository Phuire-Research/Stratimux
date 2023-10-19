import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { defaultMethodCreator, Method, MethodCreator } from '../../../model/concept';
import { Counter } from '../counter.concept';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';
// import { createMethod } from '../../../model/method';
// import { strategySuccess } from '../../../model/actionStrategy';

export const counterAddType: ActionType = 'Counter Add';

export const counterAdd = prepareActionCreator(counterAddType);
// const createAddMethodCreator: MethodCreator = () => createMethod((action) => {
//   if (action.strategy) {
//     return strategySuccess(action.strategy);
//   }
//   return action;
// });
export function addReducer(state: Counter, _: Action) {
  return {
    ...state,
    count: state.count + 1
  };
}

export const addQuality = createQuality(
  counterAddType,
  addReducer,
  defaultMethodCreator,
  [counterSelectCount]
);