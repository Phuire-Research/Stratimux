/*<$
For the framework Stratimux and Axium Concept, generate a quality with the default method and reducer.
This quality is used to signify the next step within a plan if no state change is required.
Likewise this quality is used to kick the axium into gear if currently resting due to its own halting behavior.
$>*/
/*<#*/
import { defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';

export const axiumKickType: ActionType = 'Kick Axium';
export const axiumKick = prepareActionCreator(axiumKickType);

export const axiumKickQuality = createQuality(
  axiumKickType,
  defaultReducer,
  defaultMethodCreator
);
/*#>*/