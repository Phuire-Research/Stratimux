/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept,
generate a quality will add actions into the Chain's actionQue state property.
$>*/
/*<#*/
import { Action, ActionType, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { selectPayload } from '../../../model/selector';
import { ChainState } from '../chain.concept';

export type ChainDispatchActionsPayload = {
    actions: Action[]
}
export const chainDispatchActionsType: ActionType = 'dispatch Actions from Action Que via Payload to be Chained';
export const chainDispatchActions = prepareActionWithPayloadCreator<ChainDispatchActionsPayload>(chainDispatchActionsType);

function chainPrepareChainReducer(state: ChainState, action: Action) {
  const payload = selectPayload<ChainDispatchActionsPayload>(action);
  return {
    ...state,
    actionQue: [
      ...state.actionQue,
      ...payload.actions
    ]
  };
}

export const chainPrepareChainQuality = createQuality(
  chainDispatchActionsType,
  chainPrepareChainReducer,
);
/*#>*/