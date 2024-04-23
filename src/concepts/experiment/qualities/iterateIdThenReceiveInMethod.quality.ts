/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will iterate the ID and then
set the id supplied to the method into the strategy's data field.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createMethodWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualitySet } from '../../../model/quality';

export const [
  experimentIterateIdThenReceiveInMethod,
  experimentIterateIdThenReceiveInMethodType,
  experimentIterateIdThenReceiveInMethodQuality
] = createQualitySet({
  type: 'Experiment iterate ID then receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      id: state.id + 1
    };
  },
  methodCreator: (concepts$?: Subject<Concepts>, semaphore?: number) =>
    createMethodWithState<ExperimentState>((action, state) => {
      if (action.strategy) {
        const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: state.id});
        const strategy = strategySuccess(action.strategy, data);
        return strategy;
      }
      return action;
    }, concepts$ as UnifiedSubject, semaphore as number)
});
/*#>*/