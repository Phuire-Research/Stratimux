/*<$
For the graph programming framework Stratimux and Ownership Concept, generate a quality that hard resets the current ownership ledger.
$>*/
/*<#*/
import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { createOwnershipLedger } from '../../../model/ownership';

export const ownershipResetOwnershipLedgerType: ActionType = 'reset Ownership Ledger';
export const ownershipResetOwnershipLedger = prepareActionCreator(ownershipResetOwnershipLedgerType);

function ownershipResetOwnershipLedgerReducer(state: OwnershipState, _: Action): OwnershipState {
  return {
    ...state,
    ownershipLedger: createOwnershipLedger()
  };
}
export const resetOwnershipLedgerQuality = createQuality(
  ownershipResetOwnershipLedgerType,
  ownershipResetOwnershipLedgerReducer,
  defaultMethodCreator
);
/*#>*/