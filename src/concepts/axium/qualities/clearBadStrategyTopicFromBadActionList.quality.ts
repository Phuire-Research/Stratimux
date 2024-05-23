/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will remove a strategies topic from state's badAction list.
This allows for an Artificial Intelligence that is embodying Stratimux to correct generated strategies on the fly.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { selectPayload } from '../../../model/selector';
import { createQualitySetWithPayload } from '../../../model/quality';

export type AxiumClearBadStrategyTopicFromBadActionListPayload = {
  topic: string
};
export const [
  axiumClearBadStrategyTopicFromBadActionList,
  axiumClearBadStrategyTopicFromBadActionListType,
  axiumClearBadStrategyTopicFromBadActionListQuality
] = createQualitySetWithPayload<AxiumClearBadStrategyTopicFromBadActionListPayload>({
  type: 'clear Strategy Topic from Axium\'s badAction list',
  reducer: (state: AxiumState, action) => {
    const {topic} = selectPayload<AxiumClearBadStrategyTopicFromBadActionListPayload>(action);
    const badActions = state.badActions.filter(act => {
      if (act.strategy && act.strategy.topic !== topic) {
        return true;
      } else {
        return false;
      }
    });
    return {
      ...state,
      badActions,
    };
  },
  methodCreator: defaultMethodCreator
});
/*#>*/