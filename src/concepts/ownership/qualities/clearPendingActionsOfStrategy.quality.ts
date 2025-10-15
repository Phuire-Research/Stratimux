/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality clear pending actions of the provided ActionStrategy topic.
$>*/
/*<#*/
import { OwnershipState } from '../ownership.concept';
import { selectPayload } from '../../../model/selector/selector';
import { createQualityCardWithPayload, Quality } from '../../../model/quality';
import { ActionStrategyTopic } from '../../../model/action/strategy/actionStrategy.type';
import { Action } from '../../../model/action/action.type';

export type OwnershipClearPendingActionsOfStrategyPayload = {
  topic: ActionStrategyTopic
};

export type OwnershipClearPendingActionsOfStrategy = Quality<OwnershipState, OwnershipClearPendingActionsOfStrategyPayload>
export const ownershipClearPendingActionsOfStrategy =
  createQualityCardWithPayload<OwnershipState, OwnershipClearPendingActionsOfStrategyPayload>({
    type: 'Ownership Clear Pending Actions Of Strategy',
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