/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will append a stage planner to the stagePlanners state property.
This allows for the closing of hot observables if the concept they are associated with is removed, or the muxium itself is closed.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumRegisterStagePlannerPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept';

export const muxiumRegisterStagePlanner = createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumRegisterStagePlannerPayload>({
  type: 'register Stage Planner to Muxium\'s Named Stage Planner list',
  reducer: (state, action) => {
    const payload = action.payload;
    const stagePlanners = state.stagePlanners;
    const stagePlanner = payload.stagePlanner;
    const name = payload.conceptName;
    stagePlanners.push({name, ...stagePlanner});
    return {
      stagePlanners,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/