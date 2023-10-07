import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';

export const axiumClearBadStrategyTopicFromBadActionListType: ActionType = 'clear Strategy Topic from Axium\'s badAction list';
export const axiumClearBadStrategyTopicFromBadActionList = prepareActionCreator(axiumClearBadStrategyTopicFromBadActionListType);
export type ClearBadStrategyTopicFromBadActionListPayload = string;

function clearBadStrategyTopicFromBadActionListReducer(state: AxiumState, action: Action): AxiumState {
  const strategyTopic = action.payload as ClearBadStrategyTopicFromBadActionListPayload;
  const badActions = state.badActions.filter(act => {
    if (act.strategy && act.strategy.topic !== strategyTopic) {
      return true;
    } else {
      return false;
    }
  });
  return {
    ...state,
    badActions,
  };
}

export const clearBadStrategyTopicFromBadActionListQuality = createQuality(
  axiumClearBadStrategyTopicFromBadActionListType,
  clearBadStrategyTopicFromBadActionListReducer,
  defaultMethodCreator,
);
