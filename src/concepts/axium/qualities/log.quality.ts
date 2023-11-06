import { map, Subject } from 'rxjs';
import { Method, MethodCreator, defaultReducer } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { axiumConclude } from './conclude.quality';
import { strategySuccess } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';

export const axiumLogType: ActionType = 'logged a message passed to Axium';
export const axiumLog = prepareActionCreator(axiumLogType);

export const createLogMethodCreator: MethodCreator = () => createMethod((action) => {
  console.log('Logging: ', action);
  if (action.strategy) {
    return strategySuccess(action.strategy);
  } else {
    return axiumConclude();
  }
});

export const axiumLogQuality = createQuality(
  axiumLogType,
  defaultReducer,
  createLogMethodCreator,
);
