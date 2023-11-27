/*<$
For the framework Stratimux and Experiment Concept, generate a strategy that will punt a counting strategy in favor of a new
strategy that will check in the punted strategy into an actionQue. That will later be dispatched via a principle.
$>*/
/*<#*/
import { ActionStrategy, ActionStrategyParameters, createActionNode, createStrategy, strategyPunt } from '../../../model/actionStrategy';
import { counterSelectCount } from '../../counter/counter.selector';
import { experimentCheckInStrategy } from '../qualities/checkInStrategy.quality';
import { experimentCountingStrategy } from './experimentCounting.strategy';

export const experimentPuntCountingStrategyTopic = 'This will Punt the Counting Strategy into the Experiment\'s Action Que';
export function experimentPuntCountingStrategy(): ActionStrategy {
  const stepOne = createActionNode(experimentCheckInStrategy(), {
    successNode: null,
    failureNode: null,
    keyedSelectors: [counterSelectCount]
  });

  const params: ActionStrategyParameters = {
    topic: experimentPuntCountingStrategyTopic,
    initialNode: stepOne,
  };

  return strategyPunt(experimentCountingStrategy(), createStrategy(params));
}
/*#>*/