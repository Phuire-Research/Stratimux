import { defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';
import { StagePlanner } from '../../../model/stagePlanner';

export type RegisterStagePlannerPayload = {
    stagePlanner: StagePlanner;
    conceptName: string;
}
export const axiumRegisterStagePlannerType: ActionType = 'register Stage Planner to Axium\'s Named Stage Planner list';
export const axiumRegisterStagePlanner =
  prepareActionWithPayloadCreator<RegisterStagePlannerPayload>(axiumRegisterStagePlannerType);

export function registerSubscriberReducer(state: AxiumState, action: Action): AxiumState {
  const payload = selectPayload<RegisterStagePlannerPayload>(action);
  const stagePlanners = state.stagePlanners;
  const stagePlanner = payload.stagePlanner;
  const name = payload.conceptName;
  stagePlanners.push({name, ...stagePlanner});
  return {
    ...state,
    stagePlanners,
  };
}

export const axiumRegisterStagePlannerQuality = createQuality(
  axiumRegisterStagePlannerType,
  registerSubscriberReducer,
  defaultMethodCreator
);
