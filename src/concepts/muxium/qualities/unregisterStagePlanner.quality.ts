/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will remove a stage planner from the stagePlanners state property.
This filters the stagePlanners by comparing both the conceptName and the stagePlanner title.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumUnregisterStagePlannerPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumUnregisterStagePlanner =
createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumUnregisterStagePlannerPayload>({
  type: 'Muxium Unregister Stage Planner',
  reducer: (state, action) => {
    const { conceptName, title } = action.payload;
    return {
      stagePlanners: state.stagePlanners.filter(
        planner => !(planner.name === conceptName && planner.title === title)
      )
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/