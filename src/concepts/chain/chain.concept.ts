import { Action } from '../../index';
import { createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { chainPrepareChainQuality } from './qualities/prepareChain.quality';

export type ChainState = {
    actionQue: Action[];
};

export const chainName = 'chain';

const initialChainState: ChainState = {
  actionQue: [],
};

export const createChainConcept = () => {
  return createConcept(
    chainName,
    initialChainState,
    [chainPrepareChainQuality],
    [chainPrinciple],
  );
};
