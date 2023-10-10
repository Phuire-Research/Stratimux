import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { ActionStrategyTopic } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';

export const ownershipClearPendingActionsOfStrategyType: ActionType = 'clear Ownership\'s Pending Actions of Strategy Topic';
export type ClearPendingActionsOfStrategyPayload = ActionStrategyTopic;

export function clearPendingActionsOfStrategyReducer(state: OwnershipState, action: Action): OwnershipState {
  const topic = selectPayload<ClearPendingActionsOfStrategyPayload>(action);
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
  clearPendingActionsOfStrategyReducer,
  defaultMethodCreator
);
