/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will recursively dispatch the incoming action,
limited via a control variable that is an arbitrary string array that is shifted until depleted.
$>*/
/*<#*/
import { Concepts, MethodCreator } from '../../../model/concept';
import { Action, prepareActionWithPayloadCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { ExperimentState } from '../experiment.concept';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { createAsyncMethodWithState } from '../../../model/method';
import { selectPayload } from '../../../model/selector';
import { strategyRecurse, strategySuccess } from '../../../model/actionStrategy';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { Subject } from 'rxjs';

export type ExperimentRecurseIterateId = {controlling: string[]};
export const experimentRecurseIterateIdType
  = 'Asynchronous experiment, recursively iterate ID and receive in Method via State';

export const experimentRecurseIterateId = prepareActionWithPayloadCreator<ExperimentRecurseIterateId>(experimentRecurseIterateIdType);

const experimentRecurseIterateIdCreator: MethodCreator = (concepts$?: Subject<Concepts>, semaphore?: number) =>
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
  }, concepts$ as UnifiedSubject, semaphore as number);

function experimentRecurseIterateIdReducer(state: ExperimentState, _: Action): ExperimentState {
  return {
    ...state,
    id: state.id + 1
  };
}

export const experimentRecurseIterateIdQuality = createQuality(
  experimentRecurseIterateIdType,
  experimentRecurseIterateIdReducer,
  experimentRecurseIterateIdCreator
);
/*#>*/