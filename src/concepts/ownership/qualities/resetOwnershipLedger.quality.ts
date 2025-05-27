/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a quality that hard resets the current ownership ledger.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { createOwnershipLedger } from '../../../model/ownership';
import { createQualityCard } from '../../../model/quality';

export const ownershipResetOwnershipLedger = createQualityCard<OwnershipState>({
  type: 'reset Ownership Ledger',
  reducer: () => ({ownershipLedger: createOwnershipLedger()}),
  methodCreator: defaultMethodCreator
});
/*#>*/