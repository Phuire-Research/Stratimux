/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept, generate a quality with the default method and reducer.
This quality is used to signify the next step within a plan if no state change is required.
Likewise this quality is used to kick the axium into gear if currently resting due to its own halting behavior.
$>*/
/*<#*/
import { createQualityCard, defaultMethodCreator, defaultReducer } from '../../../model/quality';

export const axiumKick = createQualityCard({
  type: 'Kick Axium',
  reducer: defaultReducer,
  methodCreator: defaultMethodCreator
});
/*#>*/