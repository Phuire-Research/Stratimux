/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will append a stage planner to the stagePlanners state property.
This allows for the closing of hot observables if the concept they are associated with is removed, or the axium itself is closed.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { StagePlanner } from '../../../model/stagePlanner';
import { createQualityCardWithPayload } from '../../../model/quality';

export type AxiumRegisterStagePlannerPayload = {
    stagePlanner: StagePlanner;
    conceptName: string;
}

export const axiumRegisterStagePlanner = createQualityCardWithPayload<AxiumState<unknown>, AxiumRegisterStagePlannerPayload>({
  type: 'register Stage Planner to Axium\'s Named Stage Planner list',
  reducer: (state, action) => {
    const payload = action.payload;
    const stagePlanners = state.stagePlanners;
    const stagePlanner = payload.stagePlanner;
    const name = payload.conceptName;
    stagePlanners.push({name, ...stagePlanner});
    return {
      ...state,
      stagePlanners,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/