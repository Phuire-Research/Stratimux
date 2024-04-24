/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will recursively dispatch the incoming action,
limited via a control variable that is an arbitrary string array that is shifted until depleted.
$>*/
/*<#*/
import { Concepts } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategyRecurse, strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';
import { createQualitySetWithPayload } from '../../../model/quality';

export type ExperimentRecurseIterateId = {
  controlling: string[]
};

export const [
  experimentRecurseIterateId,
  experimentRecurseIterateIdType,
  experimentRecurseIterateIdQuality
] = createQualitySetWithPayload<ExperimentRecurseIterateId>({
  type: 'Asynchronous experiment, recursively iterate ID and receive in Method via State',
  reducer: (state: ExperimentState) => {
    return {
      ...state,
      id: state.id + 1
    };
  },
  methodCreator: (concepts$?: Subject<Concepts>, semaphore?: number) =>
    createAsyncMethodWithState<ExperimentState>((controller, action, state) => {
      setTimeout(() => {
        const payload = selectPayload<ExperimentRecurseIterateId>(action);
        payload.controlling.shift();
        if (action.strategy) {
          const data = strategyData_unifyData<ExperimentState>(action.strategy, {id: state.id});
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
    }, concepts$ as UnifiedSubject, semaphore as number)
});
/*#>*/