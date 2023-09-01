import { createConcept } from '../../model/concept';
import { ownershipMode } from './ownership.mode';
import { initializeOwnershipQuality } from './qualities/initializeOwnership.quality';
import { ownershipPrinciple } from './ownership.principle';

export type OwnershipState = {
  initialized: boolean;
}

const initialOwnershipState: OwnershipState = {
  initialized: false,
};

export const ownershipConcept = createConcept(
  'ownership',
  initialOwnershipState,
  [
    initializeOwnershipQuality
  ],
  [
    ownershipPrinciple
  ],
  [],
  [ownershipMode]
);
