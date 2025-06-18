/*<$
For the asynchronous graph programming framework Stratimux and Chain Concept, generate a quality will set the chain end property to false
$>*/
/*<#*/
import { createQualityCard, Quality } from '../../../model/quality';
import { ChainState } from '../chain.concept';

export type ChainEnd = Quality<ChainState>;
export const chainEnd = createQualityCard<ChainState>({
  type: 'set chain end property to true',
  reducer: (state) => {
    return {
      end: true
    };
  }
});

/*#>*/