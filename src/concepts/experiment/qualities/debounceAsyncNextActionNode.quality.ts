/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously debounce the next action
in the ongoing strategy.
$>*/
/*<#*/
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { createAsyncMethodDebounce } from '../../../model/method/methodAsyncDebounce';
import { defaultReducer, Quality } from '../../../model/quality';
import { createQualityCard } from '../../../model/quality';
import { ExperimentState } from '../experiment.concept';

export type ExperimentAsyncDebounceNextActionNode = Quality<ExperimentState>;
export const experimentAsyncDebounceNextActionNode = createQualityCard({
  type: 'Experiment will debounce incoming actions within set duration asynchronously',
  reducer: defaultReducer,
  methodCreator: () => createAsyncMethodDebounce(({controller, action}) => {
    setTimeout(() => {
      if (action.strategy) {
        controller.fire(strategySuccess(action.strategy));
      } else {
        controller.fire(action);
      }
    }, 50);
  }, 500)
});
/*#>*/