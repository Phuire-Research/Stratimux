import { Action } from '../../index';
import { createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { prepareChainQuality } from './qualities/prepareChain.quality';

export type Chain = {
    actionQue: Action[];
};

export const chainKey = 'Chain';

const initialChainState: Chain = {
  actionQue: [],
};

export const chainConcept = createConcept(
  chainKey,
  initialChainState,
  [prepareChainQuality],
  [chainPrinciple],
);
