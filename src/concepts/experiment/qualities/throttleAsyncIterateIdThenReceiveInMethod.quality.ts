import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodThrottleWithConcepts } from '../../../model/method';
import { selectPayload, selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type ThrottleAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentThrottleAsyncIterateIdThenReceiveInMethodType
  = 'Action Debounce Experiment asynchronously iterate ID then receive in Method via Concept select';
export const experimentThrottleAsyncIterateIdThenReceiveInMethod
  = prepareActionWithPayloadCreator<ThrottleAsyncIterateIdThenReceiveInMethodPayload>(
    experimentThrottleAsyncIterateIdThenReceiveInMethodType
  );

const experimentThrottleAsyncIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject) =>
  createAsyncMethodThrottleWithConcepts((controller, action, concepts) => {
    setTimeout(() => {
      const payload = selectPayload<ThrottleAsyncIterateIdThenReceiveInMethodPayload>(action);
      const experimentState = selectState<ExperimentState>(concepts, experimentName);
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState & ThrottleAsyncIterateIdThenReceiveInMethodPayload>(
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

function experimentThrottleAsyncIterateIdThenReceiveInMethodReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentThrottleAsyncIterateIdThenReceiveInMethodQuality = createQuality(
  experimentThrottleAsyncIterateIdThenReceiveInMethodType,
  experimentThrottleAsyncIterateIdThenReceiveInMethodReducer,
  experimentThrottleAsyncIterateIdThenReceiveInMethodCreator
);
