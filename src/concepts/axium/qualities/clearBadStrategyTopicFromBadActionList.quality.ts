/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will remove a strategies topic from state's badAction list.
This allows for an Artificial Intelligence that is embodying Stratimux to correct generated strategies on the fly.
$>*/
/*<#*/
import { defaultMethodCreator, createQuality } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';

export type AxiumClearBadStrategyTopicFromBadActionListPayload = {
  topic: string
};
export const axiumClearBadStrategyTopicFromBadActionListType: ActionType = 'clear Strategy Topic from Axium\'s badAction list';
export const axiumClearBadStrategyTopicFromBadActionList =
  prepareActionWithPayloadCreator<AxiumClearBadStrategyTopicFromBadActionListPayload>(axiumClearBadStrategyTopicFromBadActionListType);

function axiumClearBadStrategyTopicFromBadActionListReducer(state: AxiumState, action: Action): AxiumState {
  const strategyTopic = selectPayload<AxiumClearBadStrategyTopicFromBadActionListPayload>(action).topic;
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
  axiumClearBadStrategyTopicFromBadActionListReducer,
  defaultMethodCreator,
);
/*#>*/