import { map, Subject } from 'rxjs';
import { Method, MethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { axiumConcludeType } from './conclude.quality';
import { strategySuccess } from '../../../model/actionStrategy';

export const axiumLogType: ActionType = 'logged a message passed to Axium';

const createLogMethodCreator: MethodCreator = () => {
  const logSubject = new Subject<Action>();
  const logMethod: Method = logSubject.pipe(
    map((action: Action) => {
      console.log('Logging: ', action);
      if (action.strategy) {
        return strategySuccess(action.strategy);
      }
      return createAction(axiumConcludeType);
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
