/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will clear the current pending actions list on state.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { createQualityCard } from '../../../model/quality';


export type OwnershipClearPendingActions = Quality<OwnershipState>;
export const ownershipClearPendingActions = createQualityCard<OwnershipState>({
  type: 'clear Ownership\'s Pending Actions',
  reducer: () => ({pendingActions: []}),
  methodCreator: defaultMethodCreator
});
/*#>*/