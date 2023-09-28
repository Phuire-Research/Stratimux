import { AxiumState } from '../axium.concept';
import { Action, createAction} from '../../../model/action';
import { createQuality, MethodCreator, Method } from '../../../model/concept';
import { Subject, map } from 'rxjs';
import { axiumConcludeType } from './conclude.quality';
import { strategySuccess } from '../../../model/actionStrategy';

export const axiumSetModeType = 'set Axium Mode';

export type SetModePayload = {
  modeIndex: number;
  modeName: string;
}

export const createOwnershipMethodCreator: MethodCreator = () : [Method, Subject<Action>] =>  {
  const defaultSubject = new Subject<Action>();
  const defaultMethod: Method = defaultSubject.pipe<Action>(
    map((action: Action) => {
      const payload = action.payload as SetModePayload;
      if (action.strategy) {
        action.strategy.currentNode.successNotes = {
          denoter: `to ${payload.modeName}.`
        };
        return strategySuccess(action.strategy);
      }
      return createAction(axiumConcludeType);
    }),
  );
  return [defaultMethod, defaultSubject];
};

export function setModeReducer(state: AxiumState, _action: Action) {
  const payload = _action.payload as SetModePayload;
  return {
    ...state,
    modeIndex: [payload.modeIndex],
  };
}

export const setModeQuality = createQuality(
  axiumSetModeType,
  setModeReducer,
  createOwnershipMethodCreator
);
