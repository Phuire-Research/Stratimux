/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the ID and then
set the id supplied to the method into the strategy's data field.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { createMethodWithState } from '../../../model/method/method';
import { strategyData_muxifyData } from '../../../model/action/strategy/actionStrategyData';
import { createQualityCard, Quality } from '../../../model/quality';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export type ExperimentIterateIdThenReceiveInMethod = Quality<ExperimentState>;
export const experimentIterateIdThenReceiveInMethod = createQualityCard<ExperimentState>({
  type: 'Experiment Iterate Id Then Receive In Method',
  reducer: (state) => {
    return {
      id: state.id + 1
    };
  },
  methodCreator: () => createMethodWithState(({action, state}) => {
    if (action.strategy) {
      const data = strategyData_muxifyData<ExperimentState>(action.strategy, {id: state.id});
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  })
});
/*#>*/