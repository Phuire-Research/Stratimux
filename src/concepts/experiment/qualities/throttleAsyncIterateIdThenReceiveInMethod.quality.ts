/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the id then
asynchronously dispatch the next action in the incoming strategy, then throttle the quality for a period of time.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { createAsyncMethodThrottleWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { createQualitySetWithPayload } from '../../../model/quality';

export type ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
type Data = ExperimentState & ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload;

export const [
  experimentThrottleAsyncIterateIdThenReceiveInMethod,
  experimentThrottleAsyncIterateIdThenReceiveInMethodType,
  experimentThrottleAsyncIterateIdThenReceiveInMethodQuality
] = createQualitySetWithPayload<ExperimentState, ExperimentThrottleAsyncIterateIdThenReceiveInMethodPayload>({
  type: 'Action Debounce Experiment asynchronously iterate ID then receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      id: state.id + 1
    };
  },
  methodCreator: () => createAsyncMethodThrottleWithState((controller, action, state) => {
    setTimeout(() => {
      const payload = action.payload;
      if (action.strategy) {
        const data = strategyData_unifyData<Data>(action.strategy, {
          id: state.id,
          setId: payload.setId
        });
        const strategy = strategySuccess(action.strategy, data);
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }, 500)
});
/*#>*/