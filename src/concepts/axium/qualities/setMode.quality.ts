import { AxiumState } from '../axium.concept';
import { Action, createAction, prepareActionWithPayloadCreator} from '../../../model/action';
import { createQuality, MethodCreator, Method } from '../../../model/concept';
import { Subject, map } from 'rxjs';
import { axiumConclude, axiumConcludeType } from './conclude.quality';
import { strategySuccess } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';
import { createMethod } from '../../../model/method';

export type SetModePayload = {
  modeIndex: number;
  modeName: string;
}

export const axiumSetModeType = 'set Axium Mode';
export const axiumSetMode = prepareActionWithPayloadCreator<SetModePayload>(axiumSetModeType);

export const axiumSetModeMethodCreator: MethodCreator = () => createMethod((action) => {
  const payload = action.payload as SetModePayload;
  if (action.strategy) {
    action.strategy.currentNode.successNotes = {
      denoter: `to ${payload.modeName}.`
    };
    return strategySuccess(action.strategy);
  }
  return action;
});

export function setModeReducer(state: AxiumState, _action: Action) {
  const payload = selectPayload<SetModePayload>(_action);
  return {
    ...state,
    modeIndex: [payload.modeIndex],
  };
}

export const setModeQuality = createQuality(
  axiumSetModeType,
  setModeReducer,
  axiumSetModeMethodCreator
);
