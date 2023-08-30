import { Action } from '../../index';
import { createConcept } from '../../model/concept';
import { chainPrinciple } from './chain.principle';
import { prepareChainQuality } from './qualities/prepareChain.quality';

export type Chain = {
    actionQue: Action[];
};

const initialChainState: Chain = {
  actionQue: [],
};

export const chainConcept = createConcept(
  'chain',
  initialChainState,
  [prepareChainQuality],
  [chainPrinciple],
);
