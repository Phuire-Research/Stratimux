/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will simply set ownership's initialized property to true.
$>*/
/*<#*/
import { defaultMethodCreator, Quality } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { createQualityCard } from '../../../model/quality';

export type OwnershipInitializeOwnership = Quality<OwnershipState>
export const ownershipInitializeOwnership = createQualityCard<OwnershipState>({
  type: 'Ownership Initialize to True to enable Ownership Principle',
  reducer: () => ({initialized: true}),
  methodCreator: defaultMethodCreator
});
/*#>*/