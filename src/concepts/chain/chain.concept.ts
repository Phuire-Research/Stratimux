/*<$
For the asynchronous graph programming framework Stratimux,
generate the Chain Concept that will dispatch any actions in sequence assigned to its actionQue.
This concept merely exists by example. As the issue with this concept is that it does not afford for error correction.
And would be considered a precursor to ActionStrategy.
$>*/
/*<#*/
import { Action, MuxiumDeck, PrincipleFunction } from '../../index';
import { createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { chainEnd } from './qualities/chainEnd.quality';
import { chainPrepareChain } from './qualities/prepareChain.quality';

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

export type ChainQualities = typeof chainQualities;
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