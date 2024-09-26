/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously dispatch the
next action in the ActionStrategy via a timeout. While appending to the strategy's data field the current mock value from state.
$>*/
/*<#*/
import { createAsyncMethodWithState } from '../../../model/method';
import { strategySuccess } from '../../../model/actionStrategy';
import { muxiumConclude } from '../../muxium/qualities/conclude.quality';
import { strategyData_muxifyData } from '../../../model/actionStrategyData';
import { ExperimentState } from '../experiment.concept';
import { createQualityCard, nullReducer } from '../../../model/quality';

export const experimentTimerEmitActionWithState = createQualityCard<ExperimentState>({
  type: 'Experiment create async method with timer and state, to return action',
  reducer: nullReducer,
  methodCreator: () => createAsyncMethodWithState(({controller, action, state}) => {
    setTimeout(() => {
      if (action.strategy) {
        const data = strategyData_muxifyData(action.strategy, { mock: state.mock });
        controller.fire(strategySuccess(action.strategy, data));
      } else {
        controller.fire(muxiumConclude());
      }
    }, 50);
  })
});
/*#>*/