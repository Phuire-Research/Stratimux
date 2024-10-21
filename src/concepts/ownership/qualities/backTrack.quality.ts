/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a quality that will back track the provided strategy.
$>*/
/*<#*/
import { nullReducer } from '../../../model/quality';
import { createMethod } from '../../../model/method/method';
import { createQualityCard } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { strategyBackTrack } from '../../../model/action/strategy/actionStrategyConsumersAdvanced';

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