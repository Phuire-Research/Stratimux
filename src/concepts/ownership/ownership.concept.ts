/*<$
For the asynchronous graph programming framework Stratimux generate the Ownership Concept,
that will manage Stratimux's locking functionality if loaded into the Axium.
This is accomplished via a ticketing system that will set actions to pending if their associated property is currently owned via strategy
that is currently performing operations within the Axium.
$>*/
/*<#*/
import { createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { ownershipMode } from './ownership.mode';
import { initializeOwnershipQuality } from './qualities/initializeOwnership.quality';
import { ownershipExpirationPrinciple, ownershipPrinciple } from './ownership.principle';
import { OwnershipLedger, createOwnershipLedger } from '../../model/ownership';
import { backTrackQuality } from './qualities/backTrack.quality';
import { clearPayloadStubsQuality } from './qualities/clearPayloadStubs.quality';
import { clearStrategyStubsFromLedgerAndSelfQuality } from './qualities/clearStrategyStubsFromLedgerAndSelf.quality';
import { clearPendingActionsQuality } from './qualities/clearPendingActions.quality';
import { clearPendingActionsOfStrategyQuality } from './qualities/clearPendingActionsOfStrategy.quality';
import { resetOwnershipLedgerQuality } from './qualities/resetOwnershipLedger.quality';

export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  pendingActions: Action[],
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
    isResponsibleForMode: isResponsibleForMode ? isResponsibleForMode : true
  };
};

export const createOwnershipConcept = (isResponsibleForMode?: boolean) => {
  return createConcept(
    ownershipName,
    createOwnershipState(isResponsibleForMode ? isResponsibleForMode : true),
    [
      initializeOwnershipQuality,
      backTrackQuality,
      clearPayloadStubsQuality,
      clearStrategyStubsFromLedgerAndSelfQuality,
      clearPendingActionsQuality,
      clearPendingActionsOfStrategyQuality,
      resetOwnershipLedgerQuality
    ],
    [
      ownershipPrinciple,
      ownershipExpirationPrinciple
    ],
    [ownershipMode]
  );
};
/*#>*/