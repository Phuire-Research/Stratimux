/*<$
For the asynchronous graph programming framework Stratimux generate the Ownership Concept,
that will manage Stratimux's locking functionality if loaded into the Muxium.
This is accomplished via a ticketing system that will set actions to pending if their associated property is currently owned via strategy
that is currently performing operations within the Muxium.
$>*/
/*<#*/
import { Concept, createConcept } from '../../model/concept';
import { Action } from '../../model/action';
import { ownershipMode } from './ownership.mode';
import { ownershipInitializeOwnership } from './qualities/initializeOwnership.quality';
import { ownershipExpirationPrinciple, ownershipPrinciple } from './ownership.principle';
import { OwnershipLedger, createOwnershipLedger } from '../../model/ownership';
import { ownershipBackTrack } from './qualities/backTrack.quality';
import { ownershipClearPayloadStubs } from './qualities/clearPayloadStubs.quality';
import { ownershipClearStrategyStubsFromLedgerAndSelf } from './qualities/clearStrategyStubsFromLedgerAndSelf.quality';
import { ownershipClearPendingActions } from './qualities/clearPendingActions.quality';
import { ownershipClearPendingActionsOfStrategy } from './qualities/clearPendingActionsOfStrategy.quality';
import { ownershipResetOwnershipLedger } from './qualities/resetOwnershipLedger.quality';
import { MuxiumDeck } from '../muxium/muxium.concept';
import { PrincipleFunction } from '../../model/principle';

export type OwnershipState = {
  initialized: boolean;
  ownershipLedger: OwnershipLedger;
  pendingActions: Action[],
  isResponsibleForMode: boolean;
}

export type OwnershipDeck = {
  ownership: Concept<OwnershipState, OwnershipQualities>,
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
  ownershipInitializeOwnership,
  ownershipBackTrack,
  ownershipClearPayloadStubs,
  ownershipClearStrategyStubsFromLedgerAndSelf,
  ownershipClearPendingActions,
  ownershipClearPendingActionsOfStrategy,
  ownershipResetOwnershipLedger
};

export type OwnershipQualities = typeof ownershipQualities;

export type OwnershipPrinciple = PrincipleFunction<OwnershipQualities, OwnershipDeck & MuxiumDeck, OwnershipState>

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