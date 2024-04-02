/*<$
For the graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the id, then
dispatch the next action in the incoming strategy, then throttle the quality for a period of time.
$>*/
/*<#*/
import { Concepts, MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodThrottleWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';

export type ExperimentThrottleIterateIdThenReceiveInMethodPayload = {
  setId: number;
}
export const experimentThrottleIterateIdThenReceiveInMethodType =
  'Experiment throttle iterate ID then receive in Method via State';

export const experimentThrottleIterateIdThenReceiveInMethod =
  prepareActionWithPayloadCreator<ExperimentThrottleIterateIdThenReceiveInMethodPayload>(
    experimentThrottleIterateIdThenReceiveInMethodType
  );

const experimentThrottleIterateIdThenReceiveInMethodCreator: MethodCreator = (concepts$?: Subject<Concepts>, semaphore?: number) =>
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
/*#>*/