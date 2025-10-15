/*<$
For the asynchronous graph programming framework Stratimux and Muxium Concept,
generate a quality that will remove a strategies topic from state's badAction list.
This allows for an Artificial Intelligence that is embodying Stratimux to correct generated strategies on the fly.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { MuxiumState } from '../muxium.concept';
import { createQualityCardWithPayload } from '../../../model/quality';
import { MuxiumClearBadStrategyTopicFromBadActionListPayload } from '.';
import { LoadConcepts } from '../../../model/concept/concept.type';

export const muxiumClearBadStrategyTopicFromBadActionList =
  createQualityCardWithPayload<MuxiumState<unknown, LoadConcepts>, MuxiumClearBadStrategyTopicFromBadActionListPayload>({
    type: 'Muxium Clear Bad Strategy Topic From Bad Action List',
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