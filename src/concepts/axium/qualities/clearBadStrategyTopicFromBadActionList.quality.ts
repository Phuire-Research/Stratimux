import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type ClearBadStrategyTopicFromBadActionListPayload = string;
export const axiumClearBadStrategyTopicFromBadActionListType: ActionType = 'clear Strategy Topic from Axium\'s badAction list';
export const axiumClearBadStrategyTopicFromBadActionList =
  prepareActionWithPayloadCreator<ClearBadStrategyTopicFromBadActionListPayload>(axiumClearBadStrategyTopicFromBadActionListType);

function clearBadStrategyTopicFromBadActionListReducer(state: AxiumState, action: Action): AxiumState {
  const strategyTopic = selectPayload<ClearBadStrategyTopicFromBadActionListPayload>(action);
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

export const axiumClearBadStrategyTopicFromBadActionListQuality = createQuality(
  axiumClearBadStrategyTopicFromBadActionListType,
  clearBadStrategyTopicFromBadActionListReducer,
  defaultMethodCreator,
);
