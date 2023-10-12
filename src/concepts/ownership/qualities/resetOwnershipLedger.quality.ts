import { createQuality, defaultMethodCreator } from '../../../model/concept';
import { Action, ActionType, prepareActionCreator } from '../../../model/action';
import { OwnershipState } from '../ownership.concept';
import { createOwnershipLedger } from '../../../model/ownership';

export const ownershipResetOwnershipLedgerType: ActionType = 'reset Ownership Ledger';
export const ownershipResetOwnershipLedger = prepareActionCreator(ownershipResetOwnershipLedgerType);

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
