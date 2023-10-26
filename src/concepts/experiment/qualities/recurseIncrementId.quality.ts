import { MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategyRecurse, strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';

export type RecurseIterateId = {controlling: string[]};
export const experimentRecurseIterateIdType
  = 'Asynchronous experiment, recursively iterate ID and receive in Method via State';

export const experimentRecurseIterateId = prepareActionWithPayloadCreator<RecurseIterateId>(experimentRecurseIterateIdType);

const experimentRecurseIterateIdCreator: MethodCreator = (concepts$?: UnifiedSubject, semaphore?: number) =>
  createAsyncMethodWithState<ExperimentState>((controller, action, state) => {
    setTimeout(() => {
      const payload = selectPayload<RecurseIterateId>(action);
      payload.controlling.shift();
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: state.id});
        if (payload.controlling.length > 0) {
          const strategy = strategyRecurse(action.strategy, {payload});
          controller.fire(strategy);
        } else {
          const strategy = strategySuccess(action.strategy, data);
          controller.fire(strategy);
        }
      }
      controller.fire(action);
    }, 50);
  }, concepts$ as UnifiedSubject, semaphore as number);

function experimentRecurseIterateIdReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentRecurseIterateIdQuality = createQuality(
  experimentRecurseIterateIdType,
  experimentRecurseIterateIdReducer,
  experimentRecurseIterateIdCreator
);
