/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a quality that will back track the provided strategy.
$>*/
/*<#*/
import { nullReducer } from '../../../model/quality';
import { strategyBackTrack } from '../../../model/actionStrategy';
import { createMethod } from '../../../model/method';
import { createQualityCard } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';

export const ownershipBackTrack = createQualityCard({
  type: 'backtracking to previous ActionNode',
  reducer: nullReducer,
  methodCreator: () => createMethod<OwnershipState>(({action}) => {
    if (action.strategy) {
      const newAction = strategyBackTrack(action.strategy);
      return newAction;
    } else {
      return action;
    }
  })
});
/*#>*/