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
import { ownershipInitializeOwnershipQuality } from './qualities/initializeOwnership.quality';
import { ownershipExpirationPrinciple, ownershipPrinciple } from './ownership.principle';
import { OwnershipLedger, createOwnershipLedger } from '../../model/ownership';
import { ownershipBackTrackQuality } from './qualities/backTrack.quality';
import { ownershipClearPayloadStubsQuality } from './qualities/clearPayloadStubs.quality';
import { ownershipClearStrategyStubsFromLedgerAndSelfQuality } from './qualities/clearStrategyStubsFromLedgerAndSelf.quality';
import { ownershipClearPendingActionsQuality } from './qualities/clearPendingActions.quality';
import { ownershipClearPendingActionsOfStrategyQuality } from './qualities/clearPendingActionsOfStrategy.quality';
import { ownershipResetOwnershipLedgerQuality } from './qualities/resetOwnershipLedger.quality';

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

const ownershipQualities = {
  ownershipInitializeOwnershipQuality,
  ownershipBackTrackQuality,
  ownershipClearPayloadStubsQuality,
  ownershipClearStrategyStubsFromLedgerAndSelfQuality,
  ownershipClearPendingActionsQuality,
  ownershipClearPendingActionsOfStrategyQuality,
  ownershipResetOwnershipLedgerQuality
};

export type OwnershipQualities = typeof ownershipQualities;

export const createOwnershipConcept = (isResponsibleForMode?: boolean) => {
  return createConcept<OwnershipState, OwnershipQualities>(
    ownershipName,
    createOwnershipState(isResponsibleForMode ? isResponsibleForMode : true),
    ownershipQualities,
    [
      ownershipPrinciple,
      ownershipExpirationPrinciple
    ],
    [ownershipMode]
  );
};
/*#>*/