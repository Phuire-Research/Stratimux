/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a quality that hard resets the current ownership ledger.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { OwnershipState } from '../ownership.concept';
import { createOwnershipLedger } from '../../../model/ownership';
import { createQualitySet } from '../../../model/quality';

export const [
  ownershipResetOwnershipLedger,
  ownershipResetOwnershipLedgerType,
  ownershipResetOwnershipLedgerQuality
] = createQualitySet({
  type: 'reset Ownership Ledger',
  reducer: (state: OwnershipState): OwnershipState => ({...state, ownershipLedger: createOwnershipLedger()}),
  methodCreator: defaultMethodCreator
});
/*#>*/