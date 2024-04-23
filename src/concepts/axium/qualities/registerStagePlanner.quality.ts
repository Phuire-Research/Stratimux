/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will append a stage planner to the stagePlanners state property.
This allows for the closing of hot observables if the concept they are associated with is removed, or the axium itself is closed.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';
import { StagePlanner } from '../../../model/stagePlanner';

export type AxiumRegisterStagePlannerPayload = {
    stagePlanner: StagePlanner;
    conceptName: string;
}
export const axiumRegisterStagePlannerType: ActionType = 'register Stage Planner to Axium\'s Named Stage Planner list';
export const axiumRegisterStagePlanner =
  prepareActionWithPayloadCreator<AxiumRegisterStagePlannerPayload>(axiumRegisterStagePlannerType);

function axiumRegisterSubscriberReducer(state: AxiumState, action: Action): AxiumState {
  const payload = selectPayload<AxiumRegisterStagePlannerPayload>(action);
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
  axiumRegisterSubscriberReducer,
  defaultMethodCreator
);
/*#>*/