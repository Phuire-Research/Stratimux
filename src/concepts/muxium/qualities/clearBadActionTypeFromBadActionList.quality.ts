/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will clear a specified action type from the state's badAction list.
This list is utilized by future on the fly error correction for handling generated qualities for an embodied artificial intelligence.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumClearBadActionTypeFromBadActionListPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumClearBadActionTypeFromBadActionList =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumClearBadActionTypeFromBadActionListPayload>({
    type: 'clear ActionType from Muxium\'s badAction list',
    reducer: (state, action) => {
      const {actionType} = action.payload;
      return {
        badActions: state.badActions.filter(act => act.type !== actionType),
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/