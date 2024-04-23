/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will increment state by one.
Then its method will asynchronously unify the state's id value onto the strategy.
$>*/
/*<#*/
import { Concepts, MethodCreator } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';

export const experimentAsyncIterateIdThenReceiveInMethodType
  = 'Experiment asynchronously iterate ID then receive in Method via State';

export const experimentAsyncIterateIdThenReceiveInMethod = prepareActionCreator(experimentAsyncIterateIdThenReceiveInMethodType);

const experimentAsyncIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: Subject<Concepts>, semaphore?: number) =>
  createAsyncMethodWithState<ExperimentState>((controller, action, state) => {
    setTimeout(() => {
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: state.id});
        const strategy = strategySuccess(action.strategy, data);
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }, concepts$ as UnifiedSubject, semaphore as number);

function experimentAsyncIterateIdThenReceiveInMethodReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentAsyncIterateIdThenReceiveInMethodQuality = createQuality(
  experimentAsyncIterateIdThenReceiveInMethodType,
  experimentAsyncIterateIdThenReceiveInMethodReducer,
  experimentAsyncIterateIdThenReceiveInMethodCreator
);
/*#>*/