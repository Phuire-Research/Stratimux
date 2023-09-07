import { ConceptCreator, createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { ownershipMode } from './ownership.mode';
import { initializeOwnershipQuality } from './qualities/initializeOwnership.quality';
import { ownershipPrinciple } from './ownership.principle';
import { OwnershipLedger, createOwnershipLedger } from '../../model/ownership';

export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  pendingActions: Action[],
  ticketStalls: [number, number][]
  ticker: number;
}

export const ownershipKey = 'ownership';

const initialOwnershipState: OwnershipState = {
  initialized: false,
  ownershipLedger: createOwnershipLedger(),
  pendingActions: [],
  ticketStalls: [],
  ticker: 0,
};

export const createOwnershipConcept: ConceptCreator = () => {
  return createConcept(
    ownershipKey,
    initialOwnershipState,
    [
      initializeOwnershipQuality
    ],
    [
      ownershipPrinciple
    ],
    [ownershipMode]
  );
};
