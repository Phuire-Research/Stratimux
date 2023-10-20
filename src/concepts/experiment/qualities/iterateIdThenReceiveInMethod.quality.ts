import { MethodCreator, defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodWithConcepts } from '../../../model/method';
import { selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export const experimentIterateIdThenReceiveInMethodType = 'Experiment iterate ID then receive in Method via Concept select';

export const experimentIterateIdThenReceiveInMethod = prepareActionCreator(experimentIterateIdThenReceiveInMethodType);

const experimentIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject) =>
  createMethodWithConcepts((action, concepts) => {
    const experimentState = selectState<ExperimentState>(concepts, experimentName);
    if (action.strategy) {
      const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: experimentState.id});
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  }, concepts$ as UnifiedSubject);

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
