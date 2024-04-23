/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will clear a specified plan from the badPlan list on state.
This allows for generated plans via an embodied artificial intelligence to error correct on the fly for any poorly generated plans.
$>*/
/*<#*/
import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type AxiumClearBadPlanFromBadPlanListPayload = {
  title: string
};
export const axiumClearBadPlanFromBadPlanListType: ActionType = 'clear Plan Topic from Axium\'s badPlan list';
export const axiumClearBadPlanFromBadPlanList =
  prepareActionWithPayloadCreator<AxiumClearBadPlanFromBadPlanListPayload>(axiumClearBadPlanFromBadPlanListType);

function axiumClearBadPlanFromBadPlanListReducer(state: AxiumState, action: Action): AxiumState {
  const title = selectPayload<AxiumClearBadPlanFromBadPlanListPayload>(action).title;
  return {
    ...state,
    badPlans: state.badPlans.filter(act => act.title !== title),
  };
}

export const axiumClearBadPlanFromBadPlanListQuality = createQuality(
  axiumClearBadPlanFromBadPlanListType,
  axiumClearBadPlanFromBadPlanListReducer,
  defaultMethodCreator,
);
/*#>*/