import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodThrottleWithState } from '../../../model/method';
import { selectPayload, selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type ThrottleAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentThrottleAsyncIterateIdThenReceiveInMethodType
  = 'Action Debounce Experiment asynchronously iterate ID then receive in Method via State';
export const experimentThrottleAsyncIterateIdThenReceiveInMethod
  = prepareActionWithPayloadCreator<ThrottleAsyncIterateIdThenReceiveInMethodPayload>(
    experimentThrottleAsyncIterateIdThenReceiveInMethodType
  );

const experimentThrottleAsyncIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
  createAsyncMethodThrottleWithState<ExperimentState>((controller, action, state) => {
    setTimeout(() => {
      const payload = selectPayload<ThrottleAsyncIterateIdThenReceiveInMethodPayload>(action);
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState & ThrottleAsyncIterateIdThenReceiveInMethodPayload>(
          action.strategy,
          {
            id: state.id,
            setId: payload.setId
          }
        );
        const strategy = strategySuccess(action.strategy, data);
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }, concepts$ as UnifiedSubject, semaphore as number, 500);

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
