/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will simply debounce actions till the most
recent. Then dispatch the most recent's next action via the supplied action strategy.
$>*/
/*<#*/
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { createMethodDebounce } from '../../../model/method/methodDebounce';
import { nullReducer, Quality } from '../../../model/quality';
import { createQualityCard } from '../../../model/quality';
import { ExperimentState } from '../experiment.concept';

export type ExperimentDebounceNextActionNode = Quality<ExperimentState>;
export const experimentDebounceNextActionNode = createQualityCard({
  type: 'Experiment Debounce Next Action Node',
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