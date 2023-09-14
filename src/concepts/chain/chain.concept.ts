import { Action } from '../../index';
import { ConceptCreator, createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { prepareChainQuality } from './qualities/prepareChain.quality';

export type Chain = {
    actionQue: Action[];
};

export const chainName = 'Chain';

const initialChainState: Chain = {
  actionQue: [],
};

export const createChainConcept: ConceptCreator = () => {
  return createConcept(
    chainName,
    initialChainState,
    [prepareChainQuality],
    [chainPrinciple],
  );
};
