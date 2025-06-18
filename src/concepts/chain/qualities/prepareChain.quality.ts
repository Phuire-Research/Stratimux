/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept,
generate a quality will add actions into the Chain's actionQue state property.
$>*/
/*<#*/
import { AnyAction } from '../../../model/action/action.type';
import { createQualityCardWithPayload, Quality } from '../../../model/quality';
import { ChainState } from '../chain.concept';

export type ChainPrepareChainPayload = {
    actions: AnyAction[]
}

export type ChainPrepareChain = Quality<ChainState, ChainPrepareChainPayload>;
export const chainPrepareChain = createQualityCardWithPayload<ChainState, ChainPrepareChainPayload>({
  type: 'dispatch Actions from Action Que via Payload to be Chained',
  reducer: (state, {payload}) => {
    return {
      actionQue: [
        ...state.actionQue,
        ...payload.actions
      ]
    };
  }
});
/*#>*/