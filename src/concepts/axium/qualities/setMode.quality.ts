/*<$
For the framework Stratimux and Axium Concept, generate a quality that will set the mode explicitly via the payload.
$>*/
/*<#*/
import { AxiumState } from '../axium.concept';
import { Action, prepareActionWithPayloadCreator} from '../../../model/action';
import { createQuality, MethodCreator, Method } from '../../../model/concept';
import { strategySuccess } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';
import { createMethod } from '../../../model/method';

export type AxiumSetModePayload = {
  modeIndex: number;
  modeName: string;
}

export const axiumSetModeType = 'set Axium Mode';
export const axiumSetMode = prepareActionWithPayloadCreator<AxiumSetModePayload>(axiumSetModeType);

const axiumSetModeMethodCreator: MethodCreator = () => createMethod((action) => {
  const payload = action.payload as AxiumSetModePayload;
  if (action.strategy) {
    action.strategy.currentNode.successNotes = {
      denoter: `to ${payload.modeName}.`
    };
    return strategySuccess(action.strategy);
  }
  return action;
});

function axiumSetModeReducer(state: AxiumState, _action: Action) {
  const payload = selectPayload<AxiumSetModePayload>(_action);
  return {
    ...state,
    modeIndex: [payload.modeIndex],
  };
}

export const axiumSetModeQuality = createQuality(
  axiumSetModeType,
  axiumSetModeReducer,
  axiumSetModeMethodCreator
);
/*#>*/