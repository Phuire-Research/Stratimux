/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality clear pending actions of the provided ActionStrategy topic.
$>*/
/*<#*/
import { OwnershipState } from '../ownership.concept';
import { selectPayload } from '../../../model/selectors/selector';
import { createQualityCardWithPayload } from '../../../model/quality';
import { ActionStrategyTopic } from '../../../model/action/strategy/actionStrategy.type';
import { Action } from '../../../model/action/action.type';

export type OwnershipClearPendingActionsOfStrategyPayload = {
  topic: ActionStrategyTopic
};

export const ownershipClearPendingActionsOfStrategy =
  createQualityCardWithPayload<OwnershipState, OwnershipClearPendingActionsOfStrategyPayload>({
    type: 'clear Ownership\'s Pending Actions of Strategy Topic',
    reducer: (state, action) => {
      const {topic} = selectPayload<OwnershipClearPendingActionsOfStrategyPayload>(action);
      const newPendingActions: Action[] = [];
      for (const act of state.pendingActions) {
        if (act.strategy?.topic) {
          if (act.strategy.topic !== topic) {
            newPendingActions.push(act);
          }
        }
      }
      return {
        pendingActions: newPendingActions
      };
    }
  });
/*#>*/