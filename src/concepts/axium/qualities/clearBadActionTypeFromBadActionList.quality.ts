import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type AxiumClearBadActionTypeFromBadActionListPayload = {
  actionType: ActionType
};
export const axiumClearBadActionTypeFromBadActionListType: ActionType = 'clear ActionType from Axium\'s badAction list';
export const axiumClearBadActionTypeFromBadActionList =
  prepareActionWithPayloadCreator<AxiumClearBadActionTypeFromBadActionListPayload>(axiumClearBadActionTypeFromBadActionListType);

function axiumClearBadActionTypeFromBadActionListReducer(state: AxiumState, action: Action): AxiumState {
  const actionType = selectPayload<AxiumClearBadActionTypeFromBadActionListPayload>(action).actionType;
  return {
    ...state,
    badActions: state.badActions.filter(act => act.type !== actionType),
  };
}

export const axiumClearBadActionTypeFromBadActionListQuality = createQuality(
  axiumClearBadActionTypeFromBadActionListType,
  axiumClearBadActionTypeFromBadActionListReducer,
  defaultMethodCreator,
);
