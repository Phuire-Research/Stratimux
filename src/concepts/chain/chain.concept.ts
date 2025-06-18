/*<$
For the asynchronous graph programming framework Stratimux,
generate the Chain Concept that will dispatch any actions in sequence assigned to its actionQue.
This concept merely exists by example. As the issue with this concept is that it does not afford for error correction.
And would be considered a precursor to ActionStrategy.
$>*/
/*<#*/
import { Action, Concept, MuxiumDeck, PrincipleFunction, Qualities, Quality } from '../../index';
import { createConcept } from '../../model/concept/concept';
import { chainPrinciple } from './chain.principle';
import { ChainEnd, chainEnd } from './qualities/chainEnd.quality';
import { ChainPrepareChain, chainPrepareChain } from './qualities/prepareChain.quality';

export type ChainState = {
  actionQue: Action[];
  end: boolean;
};

export const chainName = 'chain';

const initialChainState: ChainState = {
  actionQue: [],
  end: false
};

const chainQualities = {
  chainPrepareChain,
  chainEnd
};
export type ChainQualities = {
  chainPrepareChain: ChainPrepareChain,
  chainEnd: ChainEnd
}
export type ChainConcept = Concept<ChainState, ChainQualities>;
export type ChainDeck = {
  chain: Concept<ChainState, ChainQualities>
};

export type ChainPrinciple = PrincipleFunction<typeof chainQualities, MuxiumDeck, ChainState>;

export const createChainConcept = () => {
  return createConcept<ChainState, ChainQualities>(
    chainName,
    initialChainState,
    chainQualities,
    [chainPrinciple],
  );
};
/*#>*/