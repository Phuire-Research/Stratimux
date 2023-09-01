import { map, Subject } from 'rxjs';
import { strategySuccess, endOfActionStrategy } from '../../../model/actionStrategy';
import { Quality, Reducer, Method, MethodCreator } from '../../../model/concept';
import { Counter } from '../counter.concept';
import { Action, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { keyedSelectCount } from '../counter.selector';

export const subtract: Action = createAction('Counter Subtract');

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
      return endOfActionStrategy;
    })
  );
  return [
    subtractMethod,
    subtractSubject
  ];
};

export const subtractQuality = createQuality(
  subtract,
  subtractReducer,
  subtractMethodCreator,
  [keyedSelectCount]
);
