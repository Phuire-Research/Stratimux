/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the current pending actions list on state.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/concept';
import { OwnershipState } from '../ownership.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  ownershipClearPendingActions,
  ownershipClearPendingActionsType,
  ownershipClearPendingActionsQuality
] = createQualitySet({
  type: 'clear Ownership\'s Pending Actions',
  reducer: (state: OwnershipState): OwnershipState => ({...state, pendingActions: []}),
  methodCreator: defaultMethodCreator
});
/*#>*/