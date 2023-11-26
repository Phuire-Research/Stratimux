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