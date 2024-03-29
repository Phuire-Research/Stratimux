/*<$
For the graph programming framework Stratimux,
generate the Chain Concept that will dispatch any actions in sequence assigned to its actionQue.
This concept merely exists by example. As the issue with this concept is that it does not afford for error correction.
And would be considered a precursor to ActionStrategy.
$>*/
/*<#*/
import { Action } from '../../index';
import { createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { chainEndQuality } from './qualities/chainEnd.quality';
import { chainPrepareChainQuality } from './qualities/prepareChain.quality';

export type ChainState = {
  actionQue: Action[];
  end: boolean;
};

export const chainName = 'chain';

const initialChainState: ChainState = {
  actionQue: [],
  end: false
};

export const createChainConcept = () => {
  return createConcept(
    chainName,
    initialChainState,
    [chainPrepareChainQuality, chainEndQuality],
    [chainPrinciple],
  );
};
/*#>*/