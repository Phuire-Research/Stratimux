/*<$
For the graph programming framework Stratimux and Experiment Concept, generate a quality that will simply debounce actions till the most
recent. Then dispatch the most recent's next action via the supplied action strategy.
$>*/
/*<#*/
import { MethodCreator, defaultReducer } from '../../../model/concept';
import { prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { createMethodDebounce } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';

export const experimentDebounceNextActionNodeType = 'Experiment will debounce incoming actions within set duration';
export const experimentDebounceNextActionNode = prepareActionCreator(experimentDebounceNextActionNodeType);

export const experimentDebounceNextActionNodeMethodCreator: MethodCreator = () => createMethodDebounce((action) => {
  if (action.strategy) {
    return strategySuccess(action.strategy);
  } else {
    return action;
  }
}, 500);

export const debounceNextActionNodeQuality = createQuality(
  experimentDebounceNextActionNodeType,
  defaultReducer,
  experimentDebounceNextActionNodeMethodCreator
);
/*#>*/