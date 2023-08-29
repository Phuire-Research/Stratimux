import { Action, Quality, Reducer, Method, strategySuccess, endOfActionStrategy } from "../../../../mod.ts";
import { createAction } from '../../../model/action.ts';
import { createQuality } from '../../../model/concept.ts';
import { Chain } from '../chain.concept.ts';

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
)
