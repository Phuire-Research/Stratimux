import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { createOwnershipLedger } from '../../../model/ownership';

export const ownershipResetOwnershipLedgerType: ActionType = 'reset Ownership Ledger';

export function resetOwnershipLedgerReducer(state: OwnershipState, _: Action): OwnershipState {
  return {
    ...state,
    ownershipLedger: createOwnershipLedger()
  };
}
export const resetOwnershipLedgerQuality = createQuality(
  ownershipResetOwnershipLedgerType,
  resetOwnershipLedgerReducer,
  defaultMethodCreator
);
