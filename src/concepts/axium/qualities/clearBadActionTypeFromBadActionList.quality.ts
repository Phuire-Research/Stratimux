/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will clear a specified action type from the state's badAction list.
This list is utilized by future on the fly error correction for handling generated qualities for an embodied artificial intelligence.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumClearBadActionTypeFromBadActionListPayload } from '.';
import { LoadConcepts } from '../../../model/concept';

export const axiumClearBadActionTypeFromBadActionList =
  createQualityCardWithPayload<AxiumState<unknown, LoadConcepts>, AxiumClearBadActionTypeFromBadActionListPayload>({
    type: 'clear ActionType from Axium\'s badAction list',
    reducer: (state, action) => {
      const {actionType} = action.payload;
      return {
        badActions: state.badActions.filter(act => act.type !== actionType),
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/