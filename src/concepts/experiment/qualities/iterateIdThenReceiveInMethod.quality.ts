/*<$
For the graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the ID and then
set the id supplied to the method into the strategy's data field.
$>*/
/*<#*/
import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export const experimentIterateIdThenReceiveInMethodType = 'Experiment iterate ID then receive in Method via State';

export const experimentIterateIdThenReceiveInMethod = prepareActionCreator(experimentIterateIdThenReceiveInMethodType);

const experimentIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
  createMethodWithState<ExperimentState>((action, state) => {
    if (action.strategy) {
      const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: state.id});
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  }, concepts$ as UnifiedSubject, semaphore as number);

function experimentIterateIdThenReceiveInMethodReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentIterateIdThenReceiveInMethodQuality = createQuality(
  experimentIterateIdThenReceiveInMethodType,
  experimentIterateIdThenReceiveInMethodReducer,
  experimentIterateIdThenReceiveInMethodCreator
);
/*#>*/