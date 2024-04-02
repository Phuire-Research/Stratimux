/*<$
For the graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously dispatch the
next action in the ActionStrategy via a timeout. While appending to the strategy's data field the current mock value from state.
$>*/
/*<#*/
import { Concepts, MethodCreator, defaultReducer, nullReducer } from '../../../model/concept';
import { prepareActionCreator } from '../../../model/action';
import { createQuality } from '../../../model/concept';
import { createAsyncMethodWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { axiumConclude } from '../../axium/qualities/conclude.quality';
import { UnifiedSubject } from '../../../model/stagePlanner';
import { strategyData_unifyData } from '../../../model/actionStrategyData';
import { ExperimentState } from '../experiment.concept';
import { Subject } from 'rxjs';

export const experimentTimerEmitActionWithStateType = 'Experiment create async method with timer and state, to return action';
export const experimentTimerEmitActionWithState = prepareActionCreator(experimentTimerEmitActionWithStateType);

export const experimentTimerEmitActionWithStateMethodCreator: MethodCreator = (concepts$?: Subject<Concepts>, semaphore?: number) =>
  createAsyncMethodWithState<ExperimentState>((controller, action, state) => {
    setTimeout(() => {
      if (action.strategy) {
        const data = strategyData_unifyData(action.strategy, { mock: state.mock });
        controller.fire(strategySuccess(action.strategy, data));
      } else {
        controller.fire(axiumConclude());
      }
    }, 50);
  }, concepts$ as UnifiedSubject, semaphore as number);

export const timerEmitActionWithStateQuality = createQuality(
  experimentTimerEmitActionWithStateType,
  nullReducer,
  experimentTimerEmitActionWithStateMethodCreator
);
/*#>*/