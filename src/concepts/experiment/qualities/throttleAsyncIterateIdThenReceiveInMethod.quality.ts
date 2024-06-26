/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the id then
asynchronously dispatch the next action in the incoming strategy, then throttle the quality for a period of time.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodThrottleWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualitySetWithPayload } from '../../../model/quality';

export type ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

export const [
  experimentThrottleAsyncIterateIdThenReceiveInMethod,
  experimentThrottleAsyncIterateIdThenReceiveInMethodType,
  experimentThrottleAsyncIterateIdThenReceiveInMethodQuality
] = createQualitySetWithPayload<ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload>({
  type: 'Action Debounce Experiment asynchronously iterate ID then receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      id: state.id + 1
    };
  },
  methodCreator: (concepts$?: Subject<Concepts>, semaphore?: number) =>
    createAsyncMethodThrottleWithState<ExperimentState>((controller, action, state) => {
      setTimeout(() => {
        const payload = selectPayload<ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload>(action);
        if (action.strategy) {
          const data = strategyData_unifyData<ExperimentState & ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload>(
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