import { map, Subject } from 'rxjs';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { Method, MethodCreator } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { Counter } from '../counter.concept';
import { createQuality } from '../../../model/concept';
import { counterSelectCount } from '../counter.selector';
import { axiumConclude } from '../../axium/qualities/conclude.quality';

export const counterAddType: ActionType = 'Counter Add';

export const counterAdd = prepareActionCreator(counterAddType);

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
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return axiumConclude();
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