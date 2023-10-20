import { MethodCreator, defaultMethodCreator, defaultReducer } from '../../../model/concept';
import { Action, prepareActionCreator, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState, experimentName } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodDebounceWithConcepts, createMethodWithConcepts } from '../../../model/method';
import { selectPayload, selectState } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type DebounceIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentDebounceIterateIdThenReceiveInMethodType =
  'Experiment debounce iterate ID then receive in Method via Concept select';

export const experimentDebounceIterateIdThenReceiveInMethod =
  prepareActionWithPayloadCreator<DebounceIterateIdThenReceiveInMethodPayload>(experimentDebounceIterateIdThenReceiveInMethodType);

const experimentDebounceIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: UnifiedSubject) =>
  createMethodDebounceWithConcepts((action, concepts) => {
    const payload = selectPayload<DebounceIterateIdThenReceiveInMethodPayload>(action);
    const experimentState = selectState<ExperimentState>(concepts, experimentName);
    if (action.strategy) {
      const data = strategyData_unifyData<ExperimentState & DebounceIterateIdThenReceiveInMethodPayload>(action.strategy, {
        id: experimentState.id,
        setId: payload.setId
      });
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  }, concepts$ as UnifiedSubject, 500);

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
