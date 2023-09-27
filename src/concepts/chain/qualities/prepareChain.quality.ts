import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { Chain } from '../chain.concept';

export const chainDispatchActionsType: ActionType = 'dispatch Actions from Action Que via Payload to be Chained';

export const chainDispatchActions = prepareActionCreator(chainDispatchActionsType);

export type ChainDispatchActionsPayload = {
    actions: Action[]
}

export function prepareChainReducer(state: Chain, action: Action) {
  const payload = action.payload as ChainDispatchActionsPayload;
  return {
    ...state,
    actionQue: [
      ...state.actionQue,
      ...payload.actions
    ]
  };
}

export const prepareChainQuality = createQuality(
  chainDispatchActionsType,
  prepareChainReducer,
);
