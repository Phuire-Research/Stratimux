import { Action } from '../../index';
import { createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { prepareChainQuality } from './qualities/prepareChain.quality';

export type Chain = {
    actionQue: Action[];
};

export const chainName = 'chain';

const initialChainState: Chain = {
  actionQue: [],
};

export const createChainConcept = () => {
  return createConcept(
    chainName,
    initialChainState,
    [prepareChainQuality],
    [chainPrinciple],
  );
};
