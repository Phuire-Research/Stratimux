import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumClearBadActionTypeFromBadActionListType: ActionType = 'clear ActionType from Axium\'s badAction list';
export const axiumClearBadActionTypeFromBadActionList = prepareActionCreator(axiumClearBadActionTypeFromBadActionListType);
export type ClearBadActionTypeFromBadActionListPayload = ActionType;

function clearBadActionTypeFromBadActionListReducer(state: AxiumState, action: Action): AxiumState {
  const actionType = action.payload as ClearBadActionTypeFromBadActionListPayload;
  return {
    ...state,
    badActions: state.badActions.filter(act => act.type !== actionType),
  };
}

export const clearBadActionTypeFromBadActionListQuality = createQuality(
  axiumClearBadActionTypeFromBadActionListType,
  clearBadActionTypeFromBadActionListReducer,
  defaultMethodCreator,
);
