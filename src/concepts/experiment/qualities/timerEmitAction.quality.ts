/*<$
For the asynchronous graph programming framework Stratimux and Experiment Concept, generate a quality that will asynchronously dispatch the next
action in the incoming strategy via an inner timer.
$>*/
/*<#*/
import { nullReducer } from '../../../model/quality';
import { muxiumConclude } from '../../muxium/qualities/conclude.quality';
import { createQualityCard } from '../../../model/quality';
import { createAsyncMethod } from '../../../model/method/methodAsync';
import { strategySuccess } from '../../../model/action/strategy/actionStrategyConsumers';

export const experimentTimerEmitAction = createQualityCard({
  type: 'Experiment create async method with timer, to return action',
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