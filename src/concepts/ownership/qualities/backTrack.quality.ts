/*<$
For the asynchronous graph programming framework Stratimux and Ownership Concept, generate a quality that will back track the provided strategy.
$>*/
/*<#*/
import { nullReducer, Quality } from '../../../model/quality';
import { createMethod } from '../../../model/method/method';
import { createQualityCard } from '../../../model/quality';
import { OwnershipState } from '../ownership.concept';
import { strategyBackTrack } from '../../../model/action/strategy/actionStrategyConsumersAdvanced';

export type OwnershipBackTrack = Quality<OwnershipState>
export const ownershipBackTrack = createQualityCard<OwnershipState>({
  type: 'Ownership Back Track',
  reducer: nullReducer,
  methodCreator: () => createMethod(({action}) => {
    if (action.strategy) {
      const newAction = strategyBackTrack(action.strategy);
      return newAction;
    } else {
      return action;
    }
  })
});
/*#>*/