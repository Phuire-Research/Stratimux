import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export const axiumClearBadPlanFromBadPlanListType: ActionType = 'clear Plan Topic from Axium\'s badPlan list';
export const axiumClearBadPlanFromBadPlanList = prepareActionCreator(axiumClearBadPlanFromBadPlanListType);
export type ClearBadPlanFromBadPlanListPayload = string;

function clearBadPlanFromBadPlanListReducer(state: AxiumState, action: Action): AxiumState {
  const title = selectPayload<ClearBadPlanFromBadPlanListPayload>(action);
  return {
    ...state,
    badPlans: state.badPlans.filter(act => act.title !== title),
  };
}

export const clearBadPlanFromBadPlanListQuality = createQuality(
  axiumClearBadPlanFromBadPlanListType,
  clearBadPlanFromBadPlanListReducer,
  defaultMethodCreator,
);
