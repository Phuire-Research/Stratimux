/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the id, then
dispatch the next action in the incoming strategy, then throttle the quality for a period of time.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodThrottleWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualitySetWithPayload } from '../../../model/quality';

export type ExperimentThrottleIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

export const [
  experimentThrottleIterateIdThenReceiveInMethod,
  experimentThrottleIterateIdThenReceiveInMethodType,
  experimentThrottleIterateIdThenReceiveInMethodQuality
] = createQualitySetWithPayload<ExperimentThrottleIterateIdThenReceiveInMethodPayload>({
  type: 'Experiment throttle iterate ID then receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      id: state.id + 1
    };
  },
  methodCreator: (concepts$?: Subject<Concepts>, semaphore?: number) =>
    createMethodThrottleWithState<ExperimentState>((action, state) => {
      const payload = selectPayload<ExperimentThrottleIterateIdThenReceiveInMethodPayload>(action);
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload>(action.strategy, {
          id: state.id,
          setId: payload.setId
        });
        const strategy = strategySuccess(action.strategy, data);
        return strategy;
      }
      return action;
    }, concepts$ as UnifiedSubject, semaphore as number, 500)
});
/*#>*/