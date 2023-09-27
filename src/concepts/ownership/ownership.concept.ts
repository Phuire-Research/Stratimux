import { createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { ownershipMode } from './ownership.mode';
import { initializeOwnershipQuality } from './qualities/initializeOwnership.quality';
import { ownershipPrinciple } from './ownership.principle';
import { OwnershipLedger, createOwnershipLedger } from '../../model/ownership';

export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  pendingActions: Action[],
  ticker: number;
  isResponsibleForMode: boolean;
}

export const ownershipName = 'ownership';
/**
 * @param isResponsibleForMode If not set, ownership assumes responsibility.
 */
const createOwnershipState = (isResponsibleForMode?: boolean): OwnershipState => {
  return {
    initialized: false,
    ownershipLedger: createOwnershipLedger(),
    pendingActions: [],
    ticker: 0,
    isResponsibleForMode: isResponsibleForMode ? isResponsibleForMode : true
  };
};

export const createOwnershipConcept = (isResponsibleForMode?: boolean) => {
  return createConcept(
    ownershipName,
    createOwnershipState(isResponsibleForMode ? isResponsibleForMode : true),
    [
      initializeOwnershipQuality
    ],
    [
      ownershipPrinciple
    ],
    [ownershipMode]
  );
};
