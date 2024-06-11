/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the ID and then
set the id supplied to the method into the strategy's data field.
$>*/
/*<#*/
import { ExperimentState } from '../experiment.concept';
import { createMethodWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { createQualityCard } from '../../../model/quality';

export const experimentIterateIdThenReceiveInMethod = createQualityCard<ExperimentState>({
  type: 'Experiment iterate ID then receive in Method via State',
  reducer: (state) => {
    return {
      id: state.id + 1
    };
  },
  methodCreator: () => createMethodWithState((action, state) => {
    if (action.strategy) {
      const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: state.id});
      const strategy = strategySuccess(action.strategy, data);
      return strategy;
    }
    return action;
  })
});
/*#>*/