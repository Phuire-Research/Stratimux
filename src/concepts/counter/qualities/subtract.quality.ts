import { map, Subject } from 'rxjs';
import { strategySuccess } from '../../../model/actionStrategy';
import { Method, MethodCreator } from '../../../model/concept';
import { Counter } from '../counter.concept';
import { Action, ActionType, createAction, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';
import { axiumConcludeType } from '../../axium/qualities/conclude.quality';

export const counterSubtractType: ActionType = 'Counter Subtract';

export const counterSubtract = prepareActionCreator(counterSubtractType);

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
