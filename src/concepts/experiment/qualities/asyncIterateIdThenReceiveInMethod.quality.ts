/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will increment state by one.
Then its method will asynchronously unify the state's id value onto the strategy.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { strategyData_muxifyData } from '../../../model/action/strategy/actionStrategyData';
import { createQualityCard, Quality } from '../../../model/quality';
import { createAsyncMethodWithState } from '../../../model/method/methodAsync';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';


export type ExperimentAsyncIterateIdThenReceiveInMethod = Quality<ExperimentState>;
export const experimentAsyncIterateIdThenReceiveInMethod = createQualityCard<ExperimentState>({
  type: 'Experiment Async Iterate Id Then Receive In Method',
  reducer: (state) => {
    return {
      id: state.id + 1
    };
  },
  methodCreator: () => createAsyncMethodWithState(({controller, action, state}) => {
    setTimeout(() => {
      if (action.strategy) {
        const data = strategyData_muxifyData<ExperimentState>(action.strategy, {id: state.id});
        const strategy = strategySuccess(action.strategy, data);
        controller.fire(strategy);
      }
      controller.fire(action);
    }, 50);
  }),
});
/*#>*/