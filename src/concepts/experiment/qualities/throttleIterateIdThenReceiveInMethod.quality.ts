import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodThrottleWithState } from '../../../model/method';
import { selectPayload, selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type ThrottleIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentThrottleIterateIdThenReceiveInMethodType =
  'Experiment throttle iterate ID then receive in Method via State';

export const experimentThrottleIterateIdThenReceiveInMethod =
  prepareActionWithPayloadCreator<ThrottleIterateIdThenReceiveInMethodPayload>(
    experimentThrottleIterateIdThenReceiveInMethodType
  );

const experimentThrottleIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
  createMethodThrottleWithState<ExperimentState>((action, state) => {
    const payload = selectPayload<ThrottleIterateIdThenReceiveInMethodPayload>(action);
    if (action.strategy) {
      const data = strategyData_unifyData<ExperimentState & ThrottleIterateIdThenReceiveInMethodPayload>(action.strategy, {
        id: state.id,
        setId: payload.setId
      });
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  }, concepts$ as UnifiedSubject, semaphore as number, 500);

function experimentThrottleIterateIdThenReceiveInMethodReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentThrottleIterateIdThenReceiveInMethodQuality = createQuality(
  experimentThrottleIterateIdThenReceiveInMethodType,
  experimentThrottleIterateIdThenReceiveInMethodReducer,
  experimentThrottleIterateIdThenReceiveInMethodCreator
);
