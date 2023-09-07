import { map, Subject } from 'rxjs';
import { Method, MethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { endOfActionStrategyType } from '../../../model/actionStrategy';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumLogType: ActionType = 'Axium Log';

const createLogMethodCreator: MethodCreator = () => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe(
    map((action: Action) => {
      console.log('Logging: ', action);
      return createAction(endOfActionStrategyType);
    })
  );
  return [
    logMethod,
    logSubject
  ];
};

export const logQuality = createQuality(
  axiumLogType,
  defaultReducer,
  createLogMethodCreator,
);
