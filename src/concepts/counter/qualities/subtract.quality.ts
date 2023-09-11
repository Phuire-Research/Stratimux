import { map, Subject } from 'rxjs';
import { strategySuccess } from '../../../model/actionStrategy';
import { Quality, Reducer, Method, MethodCreator } from '../../../model/concept';
import { Counter } from '../counter.concept';
import { Action, ActionType, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';

export const counterSubtractType: ActionType = 'Counter Subtract';

export function subtractReducer(state: Counter) {
  return {
    ...state,
    count: state.count - 1
  };
}

const subtractMethodCreator: MethodCreator = () => {
  const subtractSubject = new Subject<Action>();
  const subtractMethod: Method = subtractSubject.pipe<Action>(
    map((action: Action) => {
      console.log('SUBTRACT');
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return createAction(axiumConcludeType);
    })
  );
  return [
    subtractMethod,
    subtractSubject
  ];
};

export const subtractQuality = createQuality(
  counterSubtractType,
  subtractReducer,
  subtractMethodCreator,
  [counterSelectCount]
);
