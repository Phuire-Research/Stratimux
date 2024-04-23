/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality clear pending actions of the provided ActionStrategy topic.
$>*/
/*<#*/
import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { ActionStrategyTopic } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';

export type OwnershipClearPendingActionsOfStrategyPayload = {
  topic: ActionStrategyTopic
};
export const ownershipClearPendingActionsOfStrategyType: ActionType = 'clear Ownership\'s Pending Actions of Strategy Topic';
export const ownershipClearPendingActionsOfStrategy =
  prepareActionWithPayloadCreator<OwnershipClearPendingActionsOfStrategyPayload>(ownershipClearPendingActionsOfStrategyType);

function ownershipClearPendingActionsOfStrategyReducer(state: OwnershipState, action: Action): OwnershipState {
  const topic = selectPayload<OwnershipClearPendingActionsOfStrategyPayload>(action).topic;
  const newPendingActions: Action[] = [];
  for (const act of state.pendingActions) {
    if (act.strategy?.topic) {
      if (act.strategy.topic !== topic) {
        newPendingActions.push(act);
      }
    }
  }
  return {
    ...state,
    pendingActions: newPendingActions
  };
}
export const clearPendingActionsOfStrategyQuality = createQuality(
  ownershipClearPendingActionsOfStrategyType,
  ownershipClearPendingActionsOfStrategyReducer,
  defaultMethodCreator
);
/*#>*/