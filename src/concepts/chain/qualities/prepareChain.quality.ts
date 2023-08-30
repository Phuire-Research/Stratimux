import { Quality, Reducer, Method } from '../../../model/concept';
import { strategySuccess, endOfActionStrategy } from '../../../model/actionStrategy';
import { Action, createAction } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { Chain } from '../chain.concept';

export const prepareChain: Action = createAction('Chain Prepare by Adding Actions to Action Que');

export type PrepareChainPayload = {
    actions: Action[]
}

export function prepareChainReducer(state: Chain, action: Action) {
  const payload = action.payload as PrepareChainPayload;
  return {
    ...state,
    actionQue: [
      ...state.actionQue,
      ...payload.actions
    ]
  };
}

export const prepareChainQuality = createQuality(
  prepareChain,
  prepareChainReducer,
);
