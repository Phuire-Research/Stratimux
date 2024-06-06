/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept,
generate a quality will add actions into the Chain's actionQue state property.
$>*/
/*<#*/
import { Action, AnyAction } from '../../../model/action';
import { createQualityCardWithPayload } from '../../../model/quality';
import { selectPayload } from '../../../model/selector';
import { ChainState } from '../chain.concept';

export type ChainPrepareChainPayload = {
    actions: AnyAction[]
}

export const chainPrepareChain = createQualityCardWithPayload<ChainState, ChainPrepareChainPayload>({
  type: 'dispatch Actions from Action Que via Payload to be Chained',
  reducer: (state, {payload}) => {
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