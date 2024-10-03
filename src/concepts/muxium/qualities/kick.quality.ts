/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept, generate a quality with the default method and reducer.
This quality is used to signify the next step within a plan if no state change is required.
Likewise this quality is used to kick the muxium into gear if currently resting due to its own halting behavior.
$>*/
/*<#*/
import { createQualityCard, defaultMethodCreator, defaultReducer } from '../../../model/quality';

export const muxiumKick = createQualityCard({
  type: 'Kick Muxium',
  reducer: defaultReducer,
  methodCreator: defaultMethodCreator
});
/*#>*/