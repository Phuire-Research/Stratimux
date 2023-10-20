import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodDebounceWithConcepts } from '../../../model/method';
import { selectPayload, selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type DebounceAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentDebounceAsyncIterateIdThenReceiveInMethodType
  = 'Debounce Experiment asynchronously iterate ID then receive in Method via Concept select';
export const experimentDebounceAsyncIterateIdThenReceiveInMethod
  = prepareActionWithPayloadCreator<DebounceAsyncIterateIdThenReceiveInMethodPayload>(
    experimentDebounceAsyncIterateIdThenReceiveInMethodType
  );

const experimentDebounceAsyncIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject) =>
  createAsyncMethodDebounceWithConcepts((controller, action, concepts) => {
    setTimeout(() => {
      const payload = selectPayload<DebounceAsyncIterateIdThenReceiveInMethodPayload>(action);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState & DebounceAsyncIterateIdThenReceiveInMethodPayload>(
          action.strategy,
          {
            id: experimentState.id,
            setId: payload.setId
          }
        );
        const strategy = strategySuccess(action.strategy, data);
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }, concepts$ as UnifiedSubject, 500);

function experimentDebounceAsyncIterateIdThenReceiveInMethodReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentDebounceAsyncIterateIdThenReceiveInMethodQuality = createQuality(
  experimentDebounceAsyncIterateIdThenReceiveInMethodType,
  experimentDebounceAsyncIterateIdThenReceiveInMethodReducer,
  experimentDebounceAsyncIterateIdThenReceiveInMethodCreator
);
