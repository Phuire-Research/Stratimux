/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will simply debounce actions till the most
recent. Then dispatch the most recent's next action via the supplied action strategy.
$>*/
/*<#*/
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { createMethodDebounce } from '../../../model/method/methodDebounce';
import { nullReducer } from '../../../model/quality';
import { createQualityCard } from '../../../model/quality';

export const experimentDebounceNextActionNode = createQualityCard({
  type: 'Experiment will debounce incoming actions within set duration',
  reducer: nullReducer,
  methodCreator: () => createMethodDebounce(({action}) => {
    if (action.strategy) {
      return strategySuccess(action.strategy);
    } else {
      return action;
    }
  }, 500)
});
/*#>*/