/*<$
For the graph programming framework Stratimux and Chain Concept, generate a quality will set the chain end property to false
$>*/
/*<#*/
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ChainState } from '../chain.concept';

export const chainEndType: ActionType = 'set chain end property to true';
export const chainEnd = prepareActionCreator(chainEndType);

function chainPrepareChainReducer(state: ChainState, action: Action) {
  return {
    ...state,
    end: true
  };
}

export const chainEndQuality = createQuality(
  chainEndType,
  chainPrepareChainReducer,
);
/*#>*/