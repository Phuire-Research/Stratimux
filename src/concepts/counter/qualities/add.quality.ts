import { map, Subject } from 'rxjs';
import { Action, ActionType } from '../../../model/action';
import { Quality, Reducer, Method, MethodCreator } from '../../../model/concept';
import { endOfActionStrategyType, strategySuccess } from '../../../model/actionStrategy';
import { Counter } from '../counter.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';

export const counterAddType: ActionType = 'Counter Add';

export function addReducer(state: Counter, _: Action) {
  return {
    ...state,
    count: state.count + 1
  };
}

const addMethodCreator: MethodCreator = () => {
  const addSubject = new Subject<Action>();
  const addMethod: Method = addSubject.pipe<Action>(
    map((action: Action) => {
      console.log('ADDITION');
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return createAction(endOfActionStrategyType);
    })
  );
  return [
    addMethod,
    addSubject
  ];
};

export const addQuality = createQuality(
  counterAddType,
  addReducer,
  addMethodCreator,
  [counterSelectCount]
);