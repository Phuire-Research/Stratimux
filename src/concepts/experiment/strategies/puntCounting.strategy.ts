import { ActionNode, ActionStrategy, ActionStrategyParameters, createStrategy, puntStrategy } from '../../../model/actionStrategy';
import { countingStrategy } from '../../counter/counter.concept';
import { counterSelectCount } from '../../counter/counter.selector';
import { experimentCheckInType } from '../qualities/checkIn.quality';

export const puntCountingStrategyTopic = 'This will Punt the Counting Strategy into the Experiment\'s Action Que';
export function puntCountingStrategy(): ActionStrategy {
  const stepOne: ActionNode = {
    actionType: experimentCheckInType,
    successNode: null,
    failureNode: null,
    keyedSelectors: [counterSelectCount]
  };

  const params: ActionStrategyParameters = {
    topic: puntCountingStrategyTopic,
    initialNode: stepOne,
  };

  return puntStrategy(countingStrategy(), createStrategy(params));
}