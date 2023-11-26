import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodDebounceWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type ExperimentDebounceIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentDebounceIterateIdThenReceiveInMethodType =
  'Experiment debounce iterate ID then receive in Method via State';

export const experimentDebounceIterateIdThenReceiveInMethod =
  prepareActionWithPayloadCreator<ExperimentDebounceIterateIdThenReceiveInMethodPayload>(
    experimentDebounceIterateIdThenReceiveInMethodType
  );

const experimentDebounceIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
  createMethodDebounceWithState<ExperimentState>((action, state) => {
    const payload = selectPayload<ExperimentDebounceIterateIdThenReceiveInMethodPayload>(action);
    if (action.strategy) {
      const data = strategyData_unifyData<ExperimentState & ExperimentDebounceIterateIdThenReceiveInMethodPayload>(action.strategy, {
        id: state.id,
        setId: payload.setId
      });
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  }, concepts$ as UnifiedSubject, semaphore as number, 500);

function experimentDebounceIterateIdThenReceiveInMethodReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentDebounceIterateIdThenReceiveInMethodQuality = createQuality(
  experimentDebounceIterateIdThenReceiveInMethodType,
  experimentDebounceIterateIdThenReceiveInMethodReducer,
  experimentDebounceIterateIdThenReceiveInMethodCreator
);
