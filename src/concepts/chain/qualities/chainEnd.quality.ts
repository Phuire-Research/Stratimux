/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept, generate a quality will set the chain end property to false
$>*/
/*<#*/
import { createQualitySet } from '../../../model/quality';
import { ChainState } from '../chain.concept';

export const [
  chainEnd,
  chainEndType,
  chainEndQuality
] = createQualitySet({
  type: 'set chain end property to true',
  reducer: (state: ChainState, action) => {
    return {
      ...state,
      end: true
    };
  }
});

/*#>*/