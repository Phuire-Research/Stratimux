/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will increment the state's ID.
Then debounce the action via the qualities method that will then unify the state's id into the strategy's data.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodDebounceWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualitySetWithPayload } from '../../../model/quality';

export type ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

export const [
  experimentDebounceAsyncIterateIdThenReceiveInMethod,
  experimentDebounceAsyncIterateIdThenReceiveInMethodType,
  experimentDebounceAsyncIterateIdThenReceiveInMethodQuality
] = createQualitySetWithPayload<ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload>({
  type: 'Debounce Experiment asynchronously iterate ID then receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      id: state.id + 1
    };
  },
  methodCreator: (concepts$?: Subject<Concepts>, semaphore?: number) =>
    createAsyncMethodDebounceWithState<ExperimentState>((controller, action, state) => {
      setTimeout(() => {
        const payload = selectPayload<ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload>(action);
        if (action.strategy) {
          const data = strategyData_unifyData<ExperimentState & ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload>(
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
    }, concepts$ as UnifiedSubject, semaphore as number, 500)
});
/*#>*/