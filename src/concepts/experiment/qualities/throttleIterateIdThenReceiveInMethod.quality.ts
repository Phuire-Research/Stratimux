/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the id, then
dispatch the next action in the incoming strategy, then throttle the quality for a period of time.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { strategyData_muxifyData } from '../../../model/action/strategy/actionStrategyData';
import { createQualityCardWithPayload, Quality } from '../../../model/quality';
import { createMethodThrottleWithState } from '../../../model/method/methodThrottle';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export type ExperimentThrottleIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

type Data = ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload;

export type ExperimentThrottleIterateIdThenReceiveInMethod =
  Quality<ExperimentState, ExperimentThrottleIterateIdThenReceiveInMethodPayload>;
export const experimentThrottleIterateIdThenReceiveInMethod =
  createQualityCardWithPayload<ExperimentState, ExperimentThrottleIterateIdThenReceiveInMethodPayload>({
    type: 'Experiment Throttle Iterate Id Then Receive In Method',
    reducer: (state) => {
      return {
        id: state.id + 1
      };
    },
    methodCreator: () => createMethodThrottleWithState(({action, state}) => {
      const payload = action.payload;
      if (action.strategy) {
        const data = strategyData_muxifyData<Data>(action.strategy, {
          id: state.id,
          setId: payload.setId
        });
        const strategy = strategySuccess(action.strategy, data);
        return strategy;
      }
      return action;
    }, 500)
  });
/*#>*/