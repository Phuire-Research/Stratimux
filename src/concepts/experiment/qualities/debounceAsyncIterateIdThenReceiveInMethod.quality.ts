/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will increment the state's ID.
Then debounce the action via the qualities method that will then unify the state's id into the strategy's data.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { strategyData_muxifyData } from '../../../model/action/strategy/actionStrategyData';
import { createQualityCardWithPayload, Quality } from '../../../model/quality';
import { createAsyncMethodDebounceWithState } from '../../../model/method/methodAsyncDebounce';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export type ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload = {
  setId: number;
}

export type ExperimentDebounceAsyncIterateIdThenReceiveInMethod =
  Quality<ExperimentState, ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload>;
export const experimentDebounceAsyncIterateIdThenReceiveInMethod =
  createQualityCardWithPayload<ExperimentState, ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload>({
    type: 'Experiment Debounce Async Iterate Id Then Receive In Method',
    reducer: (state: ExperimentState) => {
      return {
        id: state.id + 1
      };
    },
    methodCreator: () => createAsyncMethodDebounceWithState(({controller, action, state}) => {
      setTimeout(() => {
        const payload = action.payload;
        if (action.strategy) {
          const data = strategyData_muxifyData<ExperimentState & ExperimentDebounceAsyncIterateIdThenReceiveInMethodPayload>(
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
    }, 500)
  });
/*#>*/