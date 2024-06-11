/*<$
For the asynchronous graph programming framework Stratimux and Axium Concept,
generate a quality that will remove a strategies topic from state's badAction list.
This allows for an Artificial Intelligence that is embodying Stratimux to correct generated strategies on the fly.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { AxiumState } from '../axium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { AxiumClearBadStrategyTopicFromBadActionListPayload } from '.';

export const axiumClearBadStrategyTopicFromBadActionList =
  createQualityCardWithPayload<AxiumState<unknown, unknown>, AxiumClearBadStrategyTopicFromBadActionListPayload>({
    type: 'clear Strategy Topic from Axium\'s badAction list',
    reducer: (state, action) => {
      const {topic} = action.payload;
      const badActions = state.badActions.filter(act => {
        if (act.strategy && act.strategy.topic !== topic) {
          return true;
        } else {
          return false;
        }
      });
      return {
        badActions,
      };
    },
    methodCreator: defaultMethodCreator
  });
/*#>*/