import { map, Subject } from 'rxjs';
import { Action } from '../../../model/action';
import { Quality, Reducer, Method } from '../../../model/concept';
import { strategySuccess, endOfActionStrategy } from '../../../model/actionStrategy';
import { Counter } from '../counter.concept';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const add: Action = createAction('Counter Add');

export function addReducer(state: Counter, _: Action) {
  return {
    ...state,
    count: state.count + 1
  };
}
const addSubject = new Subject<Action>();
const addMethod: Method = addSubject.pipe<Action>(
  map((action: Action) => {
    console.log('ADDITION');
    if (action.strategy) {
      return strategySuccess(action.strategy);
    }
    return endOfActionStrategy;
  })
);

export const addQuality = createQuality(
  add,
  addReducer,
  addMethod,
  addSubject
);