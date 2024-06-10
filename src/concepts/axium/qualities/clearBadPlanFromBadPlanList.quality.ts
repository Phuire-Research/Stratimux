/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will clear a specified plan from the badPlan list on state.
This allows for generated plans via an embodied artificial intelligence to error correct on the fly for any poorly generated plans.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualityCard } from '../../../model/quality';

export type AxiumClearBadPlanFromBadPlanListPayload = {
  title: string
};

export const axiumClearBadPlanFromBadPlanList = createQualityCard<AxiumState<unknown, unknown>>({
  type: 'clear Plan Topic from Axium\'s badPlan list',
  reducer: (state, action) => {
    const {title} = selectPayload<AxiumClearBadPlanFromBadPlanListPayload>(action);
    return {
      ...state,
      badPlans: state.badPlans.filter(act => act.title !== title),
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/