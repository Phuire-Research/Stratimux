/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept,
generate a quality will add actions into the Chain's actionQue state property.
$>*/
/*<#*/
import { Action } from '../../../model/action';
import { createQualitySetWithPayload } from '../../../model/quality';
import { selectPayload } from '../../../model/selector';
import { ChainState } from '../chain.concept';

export type ChainPrepareChainPayload = {
    actions: Action[]
}

export const [
  chainPrepareChain,
  chainPrepareChainType,
  chainPrepareChainQuality
] = createQualitySetWithPayload<ChainPrepareChainPayload>({
  type: 'dispatch Actions from Action Que via Payload to be Chained',
  reducer: (state: ChainState, action) => {
    const payload = selectPayload<ChainPrepareChainPayload>(action);
    return {
      ...state,
      actionQue: [
        ...state.actionQue,
        ...payload.actions
      ]
    };
  }
});
/*#>*/