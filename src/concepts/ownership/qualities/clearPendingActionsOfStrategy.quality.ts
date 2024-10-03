/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality clear pending actions of the provided ActionStrategy topic.
$>*/
/*<#*/
import { Action } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { ActionStrategyTopic } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';
import { createQualityCardWithPayload } from '../../../model/quality';

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