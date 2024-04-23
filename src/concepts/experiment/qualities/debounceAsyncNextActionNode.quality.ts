/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously debounce the next action
in the ongoing strategy.
$>*/
/*<#*/
import { MethodCreator, defaultReducer } from '../../../model/concept';
import { prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { createAsyncMethodDebounce } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';

export const experimentAsyncDebounceNextActionNodeType = 'Experiment will debounce incoming actions within set duration asynchronously';
export const experimentAsyncDebounceNextActionNode = prepareActionCreator(experimentAsyncDebounceNextActionNodeType);

export const experimentDebounceNextActionNodeMethodCreator: MethodCreator = () => createAsyncMethodDebounce((controller, action) => {
  setTimeout(() => {
    if (action.strategy) {
      controller.fire(strategySuccess(action.strategy));
    } else {
      controller.fire(action);
    }
  }, 50);
}, 500);

export const asyncDebounceNextActionNodeQuality = createQuality(
  experimentAsyncDebounceNextActionNodeType,
  defaultReducer,
  experimentDebounceNextActionNodeMethodCreator
);
/*#>*/