/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will clear a specified plan from the badPlan list on state.
This allows for generated plans via an embodied artificial intelligence to error correct on the fly for any poorly generated plans.
$>*/
/*<#*/
import { createQualityCardWithPayload, defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { MuxiumClearBadPlanFromBadPlanListPayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const muxiumClearBadPlanFromBadPlanList =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumClearBadPlanFromBadPlanListPayload>({
    type: 'clear Plan Topic from Muxium\'s badPlan list',
    reducer: (state, action) => {
      const {title} = action.payload;
      return {
        badPlans: state.badPlans.filter(act => act.title !== title),
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/