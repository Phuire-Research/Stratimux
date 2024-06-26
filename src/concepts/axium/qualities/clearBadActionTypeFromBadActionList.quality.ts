/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will clear a specified action type from the state's badAction list.
This list is utilized by future on the fly error correction for handling generated qualities for an embodied artificial intelligence.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { ActionType } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumClearBadActionTypeFromBadActionListPayload = {
  actionType: ActionType
};
export const [
  axiumClearBadActionTypeFromBadActionList,
  axiumClearBadActionTypeFromBadActionListType,
  axiumClearBadActionTypeFromBadActionListQuality
] = createQualitySetWithPayload<AxiumClearBadActionTypeFromBadActionListPayload>({
  type: 'clear ActionType from Axium\'s badAction list',
  reducer: (state: AxiumState, action) => {
    const {actionType} = selectPayload<AxiumClearBadActionTypeFromBadActionListPayload>(action);
    return {
      ...state,
      badActions: state.badActions.filter(act => act.type !== actionType),
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/