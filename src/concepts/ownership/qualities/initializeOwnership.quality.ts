/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept,
generate a quality that will simply set ownership's initialized property to true.
$>*/
/*<#*/
import { defaultMethodCreator } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { createQualitySet } from '../../../model/quality';

export const [
  ownershipInitializeOwnership,
  ownershipInitializeOwnershipType,
  ownershipInitializeOwnershipQuality
] = createQualitySet<OwnershipState>({
  type: 'Ownership Initialize to True to enable Ownership Principle',
  reducer: (state) => ({...state, initialized: true}),
  methodCreator: defaultMethodCreator
});
/*#>*/