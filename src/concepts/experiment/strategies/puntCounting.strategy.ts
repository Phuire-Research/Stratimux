/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept,
generate a strategy that will punt a counting strategy in favor of a new
strategy that will check in the punted strategy into an actionQue. That will later be dispatched via a principle.
$>*/
/*<#*/
import { createActionNode, createStrategy } from '../../../model/action/strategy/actionStrategy';
import { ActionStrategy } from '../../../model/action/strategy/actionStrategy.type';
import { strategyPunt } from '../../../model/action/strategy/actionStrategyConsumersAdvanced';
import { counterSelectCount } from '../../counter/counter.selector';
import { additionalCountingStrategy } from '../../counter/strategies/counting.strategy';
import { ExperimentCountingDeck } from './experimentCounting.strategy';

export const experimentPuntCountingStrategyTopic = 'This will Punt the Counting Strategy into the Experiment\'s Action Que';
export function experimentPuntCountingStrategy(deck: ExperimentCountingDeck): ActionStrategy | undefined {
  const stepOne = createActionNode(deck.experiment.e.experimentCheckInStrategy(), {
    keyedSelectors: [counterSelectCount],
    agreement: 10000
  });

  const strategy = additionalCountingStrategy(deck);
  if (strategy) {
    // Set agreement on all nodes in the strategy
    if (strategy.currentNode) {
      let node: any = strategy.currentNode;
      while (node) {
        node.agreement = 10000;
        node = node.successNode;
      }
    }
    return strategyPunt(strategy, createStrategy({
      topic: experimentPuntCountingStrategyTopic,
      initialNode: stepOne,
    }));
  }
  return undefined;
}
/*#>*/