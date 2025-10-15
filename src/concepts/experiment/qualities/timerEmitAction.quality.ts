/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously dispatch the next
action in the incoming strategy via an inner timer.
$>*/
/*<#*/
import { nullReducer, Quality } from '../../../model/quality';
import { muxiumConclude } from '../../muxium/qualities/conclude.quality';
import { createQualityCard } from '../../../model/quality';
import { createAsyncMethod } from '../../../model/method/methodAsync';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';
import { ExperimentState } from '../experiment.concept';


export type ExperimentTimerEmitAction = Quality<ExperimentState>
export const experimentTimerEmitAction = createQualityCard({
  type: 'Experiment Timer Emit Action',
  reducer: nullReducer,
  methodCreator: () => createAsyncMethod(({controller, action}) => {
    setTimeout(() => {
      if (action.strategy) {
        controller.fire(strategySuccess(action.strategy));
      } else {
        controller.fire(muxiumConclude());
      }
    }, 50);
  })
});
/*#>*/