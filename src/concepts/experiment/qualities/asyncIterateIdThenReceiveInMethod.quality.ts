/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will increment state by one.
Then its method will asynchronously unify the state's id value onto the strategy.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept/concept';
import { ExperimentState } from '../experiment.concept';
import { MuxifiedSubject } from '../../../model/stagePlanner/stagePlanner';
import { strategyData_muxifyData } from '../../../model/action/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualityCard } from '../../../model/quality';
import { createAsyncMethodWithState } from '../../../model/method/methodAsync';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export const experimentAsyncIterateIdThenReceiveInMethod = createQualityCard<ExperimentState>({
  type: 'Experiment asynchronously iterate ID then receive in Method via State',
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