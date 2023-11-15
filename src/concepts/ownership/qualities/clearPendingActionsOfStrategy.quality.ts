import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { ActionStrategyTopic } from '../../../model/actionStrategy';
import { selectPayload } from '../../../model/selector';

export type ClearPendingActionsOfStrategyPayload = {
  topic: ActionStrategyTopic
};
export const ownershipClearPendingActionsOfStrategyType: ActionType = 'clear Ownership\'s Pending Actions of Strategy Topic';
export const ownershipClearPendingActionsOfStrategy =
  prepareActionWithPayloadCreator<ClearPendingActionsOfStrategyPayload>(ownershipClearPendingActionsOfStrategyType);

export function clearPendingActionsOfStrategyReducer(state: OwnershipState, action: Action): OwnershipState {
  const topic = selectPayload<ClearPendingActionsOfStrategyPayload>(action).topic;
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
