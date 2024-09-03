/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the id, then
dispatch the next action in the incoming strategy, then throttle the quality for a period of time.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { MuxifiedSubject } from '../../../model/stagePlanner';
import { createMethodThrottleWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_muxifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualityCardWithPayload } from '../../../model/quality';

export type ExperimentThrottleIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

type Data = ExperimentState & ExperimentThrottleIterateIdThenReceiveInMethodPayload;

export const experimentThrottleIterateIdThenReceiveInMethod =
  createQualityCardWithPayload<ExperimentState, ExperimentThrottleIterateIdThenReceiveInMethodPayload>({
    type: 'Experiment throttle iterate ID then receive in Method via State',
    reducer: (state) => {
      return {
        id: state.id + 1
      };
    },
    methodCreator: () => createMethodThrottleWithState((action, state) => {
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