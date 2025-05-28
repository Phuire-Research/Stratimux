/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will recursively dispatch the incoming action,
limited via a control variable that is an arbitrary string array that is shifted until depleted.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { strategyData_muxifyData } from '../../../model/action/strategy/actionStrategyData';
import { createQualityCardWithPayload, Quality } from '../../../model/quality';
import { createAsyncMethodWithState } from '../../../model/method/methodAsync';
import { strategyRecurse } from '../../../model/action/strategy/actionStrategyConsumersAdvanced';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export type ExperimentRecurseIterateIdPayload = {
  controlling: string[]
};


export type ExperimentRecurseIterateId = Quality<ExperimentState, ExperimentRecurseIterateIdPayload>;
export const experimentRecurseIterateId = createQualityCardWithPayload<ExperimentState, ExperimentRecurseIterateIdPayload>({
  type: 'Asynchronous experiment, recursively iterate ID and receive in Method via State',
  reducer: (state) => {
    return {
      id: state.id + 1
    };
  },
  methodCreator: () => createAsyncMethodWithState(({controller, action, state}) => {
    setTimeout(() => {
      const payload = action.payload;
      payload.controlling.shift();
      if (action.strategy) {
        const data = strategyData_muxifyData<ExperimentState>(action.strategy, {id: state.id});
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
  })
});
/*#>*/