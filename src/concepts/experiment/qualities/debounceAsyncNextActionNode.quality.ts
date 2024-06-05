/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously debounce the next action
in the ongoing strategy.
$>*/
/*<#*/
import { defaultReducer } from '../../../model/quality';
import { createAsyncMethodDebounce } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { createQualitySet } from '../../../model/quality';

export const [
  experimentAsyncDebounceNextActionNode,
  experimentAsyncDebounceNextActionNodeType,
  experimentAsyncDebounceNextActionNodeQuality
] = createQualitySet({
  type: 'Experiment will debounce incoming actions within set duration asynchronously',
  reducer: defaultReducer,
  methodCreator: createAsyncMethodDebounce((controller, action) => {
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