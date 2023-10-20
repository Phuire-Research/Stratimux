import { MethodCreator, defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodWithConcepts, createMethodWithConcepts } from '../../../model/method';
import { selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export const experimentAsyncIterateIdThenReceiveInMethodType
  = 'Experiment asynchronously iterate ID then receive in Method via Concept select';

export const experimentAsyncIterateIdThenReceiveInMethod = prepareActionCreator(experimentAsyncIterateIdThenReceiveInMethodType);

const experimentAsyncIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject) =>
  createAsyncMethodWithConcepts((controller, action, concepts) => {
    console.log('HIT');
    setTimeout(() => {
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: experimentState.id});
        const strategy = strategySuccess(action.strategy, data);
        console.log('FIRE');
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }, concepts$ as UnifiedSubject);

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
