import { map, Subject } from 'rxjs';
import { Method, MethodCreator, Quality, Reducer, defaultReducer } from '../../../model/concept';
import { Action } from '../../../model/action';
import { endOfActionStrategy } from '../../../model/actionStrategy';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const log: Action = createAction('Axium Log');

const createLogMethodCreator: MethodCreator = () => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe<Action>(
    map((action: Action) => {
      console.log('Logging: ', action);
      return endOfActionStrategy;
    })
  );
  return [
    logMethod,
    logSubject
  ];
};


export const logQuality = createQuality(
  log,
  defaultReducer,
  createLogMethodCreator,
);
