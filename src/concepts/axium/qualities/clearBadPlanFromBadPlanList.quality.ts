import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type ClearBadPlanFromBadPlanListPayload = {
  title: string
};
export const axiumClearBadPlanFromBadPlanListType: ActionType = 'clear Plan Topic from Axium\'s badPlan list';
export const axiumClearBadPlanFromBadPlanList =
  prepareActionWithPayloadCreator<ClearBadPlanFromBadPlanListPayload>(axiumClearBadPlanFromBadPlanListType);

function clearBadPlanFromBadPlanListReducer(state: AxiumState, action: Action): AxiumState {
  const title = selectPayload<ClearBadPlanFromBadPlanListPayload>(action).title;
  return {
    ...state,
    badPlans: state.badPlans.filter(act => act.title !== title),
  };
}

export const axiumClearBadPlanFromBadPlanListQuality = createQuality(
  axiumClearBadPlanFromBadPlanListType,
  clearBadPlanFromBadPlanListReducer,
  defaultMethodCreator,
);
